import express from "express";
import {
  addItem,
  deleteItem,
  editItem,
  getItemByCity,
  getItemById,
  getItemsByShop,
  rating,
  searchItems,
} from "../controllers/item.controllers.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { aiItemSearch } from "../controllers/aiSearchController.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-by-city/:city", isAuth, getItemByCity);
itemRouter.get("/get-by-shop/:shopId", isAuth, getItemsByShop);
itemRouter.post("/rating", isAuth, rating);
itemRouter.get("/search-items", isAuth, searchItems);
itemRouter.post("/ai-search", isAuth, aiItemSearch);

export default itemRouter;
