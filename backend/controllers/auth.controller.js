import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

    res.cookie("token", token, authCookieOptions);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// LOGIN USER
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

    res.cookie("token", token, authCookieOptions);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// LOGOUT USER
export const signOut = async (req, res) => {
  try {
    const { maxAge, ...clearCookieOptions } = authCookieOptions;
    res.clearCookie("token", clearCookieOptions);

    return res.status(201).json({
      success: true,
      message: "LOG OUT SUCCESFULLY",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// RESET PASSWORD OTP - 1ST STAGE
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "NO USER FOUND" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      message: "OTP SEND SUCCESFULLY",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// 2ND STAGE
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

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

// 3RD STAGE RESET PASSWORD
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
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    if (!fullName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Google account details are incomplete",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // The User schema requires a password even for Google accounts.
      // Generate a random value that is never exposed to the client and
      // store only its bcrypt hash. Google users still authenticate via Google.
      const googlePassword = await bcrypt.hash(randomUUID(), 10);

      user = await User.create({
        fullName,
        email,
        password: googlePassword,
        mobile: mobile || "0000000000",
        role,
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, authCookieOptions);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Google authentication failed",
    });
  }
};
