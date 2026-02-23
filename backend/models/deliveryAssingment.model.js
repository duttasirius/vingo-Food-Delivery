import mongoose from "mongoose";

const deliveryAssingmentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    shopOrderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    broscastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "expired"],
      default: "broscasted",
    },

    acceptedAt: Date,
  },
  { timestamps: true },
);

const deliveryAssingment = mongoose.model(
  "deliveryAssingment",
  deliveryAssingmentSchema,
);

export default deliveryAssingment;
