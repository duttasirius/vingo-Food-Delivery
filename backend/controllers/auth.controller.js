import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

// REGISTER USER
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "USER ALREDAY EXIST" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "PASSWORD MUST BE AT LEAST 6 DIGIT" });
    }

    if (mobile.length < 10) {
      return res.status(400).json({ message: "NUMBER MUST BE 6 DIGIT" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      mobile,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// login user
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "NO USER FOUND" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "INCORRECT PASSWORD" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// logout user

export const signOut = async () => {
  try {
    res.clearCookie("token");

    return res.status(201).json({
      success: true,
      message: "LOG OUT SUCCESFULLY",
    });
  } catch (error) {
    console.log(error);
  }
};

// reset password otp 1ts stage

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "NO USER FOUND" });
    }

    // Generate a 4-digit OTP

    // Math.random() → gives a decimal number between 0 and 0.9999
    // Example: 0.345, 0.912, 0.001

    // Multiply by 9000 → now range becomes 0 to 8999
    // We use 9000 because we want exactly 9000 possible numbers (1000–9999)

    // Add 1000 → shifts range from:
    // 0–8999  →  1000–9999
    // This ensures OTP is always 4 digits (never 0123 or 0987)

    // Math.floor() → removes decimal part
    // Example: 4821.78 → 4821

    // Final range after floor:
    // 1000 → 9999 (perfect 4-digit OTP)

    // toString() → convert number to string
    // Needed because OTP is usually stored/sent as text

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;

    // / Set an expiry time 5 minutes from now

    // Date.now()
    // → returns current time in milliseconds since Jan 1, 1970 (Unix epoch)
    // Example: 1707312345678

    // 5 * 60 * 1000
    // 5   → minutes
    // 60  → seconds in 1 minute
    // 1000 → milliseconds in 1 second

    // So:
    // 5 * 60 * 1000 = 300000 milliseconds
    // = 5 minutes

    // Date.now() + 5 * 60 * 1000
    // → current time + 5 minutes
    // This creates an expiry timestamp in the future

    user.otpExpires = Date.now() + 5 * 60 * 1000;

    user.isOtpVerified = false;

    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      message: "OTP SEND SUCCESFULLY",
    });
  } catch (error) {
    console.log(error);
  }
};

// 2nd stage

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    console.log("BODY:", req.body);
    console.log("DB OTP:", user?.resetOtp);
    console.log("USER INPUT OTP:", otp);
    console.log("EXPIRE:", user?.otpExpires);
    console.log("NOW:", Date.now());

    // user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // wrong otp
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // success
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3 rd stage RESET PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    console.log("RESET BODY:", req.body);
    console.log("isOtpVerified:", user?.isOtpVerified);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isOtpVerified !== true) {
      return res.status(400).json({
        message: "OTP verification required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // reset flags AFTER password change
    user.isOtpVerified = false;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.log(err);
  }
};
