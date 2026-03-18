import mongoose from "mongoose";

const shopOrderItemsSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  price: Number,
  name: String,
  quantity: Number,
});

const shopOrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subTotal: Number,
    shopOrderItems: [shopOrderItemsSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out of delivery", "delivered"],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "deliveryAssingment",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },

    otpExpires: { type: Date, default: null },

    payment: {
      type: Boolean,
      default: false,
    },
    // this id created when user click pay now before payment gateway popup
    razorpayOrderId: {
      type: String,
      default: "",
    },
    // this payment id created after succesfull payment
    razorpayPaymentId: {
      type: String,
      default: "",
    },
  },

  { timestamps: true },
);

const orderSchema = new mongoose.Schema(
  {
    //making schema to a particular model
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    deliveryAddress: { text: String, latitude: Number, longitude: Number },
    totalAmount: { type: Number },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
