import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, enum: ["cod", "online"] },
    deliveryAddress: { text: String, latitude: Number, longitude: Number },
    totalAmount: { type: Number },
    shopOrder: [],
  },
  { timestamps: true },
);
