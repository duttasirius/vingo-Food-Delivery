import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: String, required: true },
    //Store a user’s ID here and link this document to that user.
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    // array because we add multiple items in our cart
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  { timestamps: true },
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
