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
      default: "brodcasted",
    },

    acceptedAt: Date,
  },
  { timestamps: true },
);

const DeliveryAssingment = mongoose.model(
  "DeliveryAssingment",
  deliveryAssingmentSchema,
);

export default DeliveryAssingment;
