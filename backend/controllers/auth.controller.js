import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

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

    return res.status(200).json({
      success: true,
      message: "LOG OUT SUCCESFULLY",
    });
  } catch (error) {
    console.log(error);
  }
};
