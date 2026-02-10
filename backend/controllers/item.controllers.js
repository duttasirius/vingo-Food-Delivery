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

    return res.status(201).json(item);
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

    const item = await Item.findOne({ _id: itemId, shop: shop._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // update fields
    if (name) item.name = name;
    if (category) item.category = category;
    if (foodType) item.foodType = foodType;
    if (price) item.price = price;
    if (image) item.image = image;

    await item.save();

    return res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
