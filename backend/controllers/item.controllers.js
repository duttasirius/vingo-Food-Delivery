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

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.json({
        success: false,
        message: "NO CITY FOUND",
      });
    }

    const shops = await Shop.find({
      // match city exactly but ignore uppercase/lowercase
      // ^ → start of word
      // $ → end of word
      // ensures only exact city matches
      // "i" flag → case insensitive
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (shops.length === 0) {
      return res.json({
        success: false,
        message: "NO SHOPS FOUND",
      });
    }

    // shops comming from line 253 variable and store all shops id here
    const shopIds = shops.map((shop) => shop._id);

    // VISUAL REPRESENT OF THIS LINE
    //     City: Kolkata

    // Step 1 → find shops in Kolkata
    // shops = [shop1, shop2]

    // Step 2 → extract their IDs
    // shopIds = [id1, id2]

    // Step 3 → find items whose shop field matches those IDs
    // Item.find({ shop: { $in: [id1, id2] } })

    const items = await Item.find({ shop: { $in: shopIds } }).populate("shop");

    //     City = Kolkata

    // 1️⃣ Find shops in Kolkata
    //    shops = [ShopA, ShopB]

    // 2️⃣ Extract their IDs
    //    shopIds = [idA, idB]

    // 3️⃣ Find items where:
    //    item.shop is idA OR idB

    //    Item collection:
    //    --------------------------------
    //    Burger   → shop: idA   ✅ include
    //    Pizza    → shop: idA   ✅ include
    //    Coffee   → shop: idB   ✅ include
    //    Noodles  → shop: idX   ❌ ignore

    // 4️⃣ populate("shop")
    //    replaces:
    //    shop: "idA"
    //    with:
    //    shop: { _id: "idA", name: "The Park", city: "Kolkata" }
    // */

    // --------------------------------------------------------
    // 🧠 WHY THIS IS NEEDED
    // --------------------------------------------------------

    // We cannot directly search items by city,
    // because items only know their shop ID.
    // So we:
    //   city → shops → shopIds → items

    // This acts like a JOIN between Shop and Item collections.

    return res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getItemsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId).populate("items");

    if (!shop) {
      return res.json({
        success: false,
        message: "NO SHOPS FOUND",
      });
    }

    return res.json({
      success: true,
      shop,
      items: shop.items,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;

    if (!itemId || !rating) {
      return res.json({
        success: false,
        message: "ITEM & RATING IS REQUIRED",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "RATING MUST BE BETWEEN 1- 5",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.json({
        success: false,
        message: "NO ITEM FOUND",
      });
    }

    // finding how many user review the food
    const newCount = item.rating.count + 1;

    const newAverage =
      (item.rating.average * item.rating.count + rating) / newCount;

    //     item.rating.average → Current average rating of the item
    // item.rating.count → Total number of users who rated the item
    // rating → New rating submitted by the current user
    // newCount → Updated rating count after this user rates

    item.rating.count = newCount;

    item.rating.average = newAverage;

    await item.save();

    return res.json({
      success: true,
      rating: item.rating,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const searchItems = async (req, res) => {
  try {
    // user's question coming from request body mostly from search inputs
    const { query, city } = req.query;

    if (!query || !city) {
      return res.json({
        success: false,
        message: "QUERY AND CITY REQUIRED",
      });
    }

    const shops = await Shop.find({
      // match city exactly but ignore uppercase/lowercase
      // ^ → start of word
      // $ → end of word
      // ensures only exact city matches
      // "i" flag → case insensitive
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    // Shop.find() returns an array → check length
    if (shops.length === 0) {
      return res.json({
        success: false,
        message: "NO SHOPS FOUND",
      });
    }

    // store all shop IDs
    const shopId = shops.map((s) => s._id);

    // find items that belong to any of the shops in shopId array
    // $in = match any value inside the array
    // example: shopId = [shop1, shop2] → returns items from those shops only
    const items = await Item.find({
      // find only those items which id store in shopid
      shop: { $in: shopId },

      // search by name OR category
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name image");

    return res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
