import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.json({ success: false, message: "NO SHOP FOUND" });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    // 👉 Add the newly created item's ObjectId into the shop's items array
    // shop.items is an array in the Shop schema that stores references (ObjectIds)
    // to all items belonging to this shop
    shop.items.push(item._id);

    // 👉 Save the updated shop document in MongoDB
    // This persists the new item reference inside the shop's items array
    await shop.save();

    // 👉 Populate replaces ObjectIds with full documents
    // "items" → replaces each itemId with full item data
    // "owner" → replaces ownerId with full owner (user) data
    // After this, shop.items will contain complete item objects instead of just IDs
    await shop.populate("items owner");

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      item,
      shop,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      const upload = await uploadOnCloudinary(req.file.path);
      image = upload.secure_url || upload.url;
    }

    // find user's shop
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // find item inside that shop
    const item = await Item.findOne({ _id: itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // 🔥 UPDATE FIELDS
    if (name) item.name = name;
    if (category) item.category = category;
    if (foodType) item.foodType = foodType;
    if (price) item.price = price;
    if (image) item.image = image;

    await item.save();

    // repopulate shop items for frontend redux update
    //What populate does --- tells Mongoose “Go to Item collection, fetch each item document whose ID is in shop.items, and replace IDs with full objects.”

    const updatedShop = await Shop.findById(shop._id).populate("items");

    return res.json({
      success: true,
      item,
      shop: updatedShop,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.json({
        success: false,
        message: "NO ITEM FOUND",
      });
    }

    return res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // 1️⃣ Delete the item from Item collection
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // 2️⃣ Find the shop of the logged-in owner
    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "Shop not found or not authorized",
      });
    }

    // 3️⃣ Remove that item ID from shop.items array
    //You need that filter because deleting an item from the Item collection does not remove its ID from the shop’s items array — and leaving it there would cause broken references and null values when populating.
    shop.items = shop.items.filter((id) => id.toString() !== itemId);

    await shop.save();

    // 4️⃣ Get updated shop with full item objects

    const updatedShop = await Shop.findById(shop._id).populate("items");
    // populate("items")
    // ----------------------------
    // The shop document only stores item IDs like:
    // items: ["itemId1", "itemId2"]
    //
    // populate("items") tells MongoDB:
    // → Go to the Item collection
    // → Find all items whose IDs are in shop.items
    // → Replace those IDs with the full item objects
    //
    // So AFTER populate:
    // shop.items becomes:
    // [
    //   { _id: "...", name: "Burger", price: 120 },
    //   { _id: "...", name: "Pizza", price: 200 }
    // ]
    //
    // WHY we need this:
    // Frontend Redux/UI needs full item data (name, price, image)
    // not just item IDs.
    //
    // Without populate:
    // shop.items = ["id1", "id2"]   ❌ only IDs
    //
    // With populate:
    // shop.items = [{name, price}, ...]  ✅ usable data for UI
    //
    // When to use:
    // Anytime you send shop → frontend and UI shows items.
    //
    // Important:
    // populate does NOT create data.
    // It only fetches related item documents from Item collection.

    // 5️⃣ Send updated shop back to frontend
    return res.status(200).json({
      success: true,
      shop: updatedShop,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Delete item error",
    });
  }
};
