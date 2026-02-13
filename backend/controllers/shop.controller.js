import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../models/item.model.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    // CREATE SHOP
    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    }
    // UPDATE SHOP
    else {
      const updateData = {
        name,
        city,
        state,
        address,
      };

      if (image) updateData.image = image;

      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner");

    return res.json({
      success: true,
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

// getting owner shop
export const getMyShop = async (req, res) => {
  try {
    // find shop of logged-in owner
    // populate("owner") → replace ownerId with full user document
    // populate("items") → replace itemIds with full item documents
    // without populate we only get IDs, not actual data
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate("items");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No shop found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      // match city exactly but ignore uppercase/lowercase
      // ^ → start of word
      // $ → end of word
      // ensures only exact city matches
      // "i" flag → case insensitive
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops) {
      return res.json({
        success: false,
        message: "NO SHOPS FOUND",
      });
    }

    return res.json({
      success: true,
      shops,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
