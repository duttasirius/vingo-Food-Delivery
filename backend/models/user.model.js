import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "owner", "deliveryBoy"],
    },

    resetOtp: {
      type: String,
    },
    isOtpVerified: { type: Boolean, default: false },

    otpExpires: { type: Date },

    // this is geoJson while we saved location
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      // // at coordinates we need to wrote 1st longtitude & then lattitude
      coordinates: { type: [Number], default: [0, 0] },
      // inside Geojson coordinates always saved longitude then lattitude
    },
  },

  { timestamps: true },
);

// we need to informed mongodb treat location as a coordinates or MAP
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;
