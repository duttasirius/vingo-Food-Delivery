import React, { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      setErr("");
      dispatch(setUserData(result.data.user));
      navigate("/");
    } catch (error) {
      console.log("SIGN IN ERROR:", error.response?.data || error.message);
      setErr(getApiErrorMessage(error, "Unable to sign in. Please try again."));
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${serverurl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile: "0000000000",
        },
        { withCredentials: true },
      );

      dispatch(setUserData(data.user));
      setErr("");
      navigate("/");
    } catch (error) {
      console.log("GOOGLE SIGN IN ERROR:", error.response?.data || error.message);
      setErr(
        getApiErrorMessage(error, "Google sign in failed. Please try again."),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-orange-500 mb-2">VINGO</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Sign In your account & order delicious food at your doorstep
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="relative mt-1">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {!showPassword ? (
                <IoIosEye size={20} />
              ) : (
                <FaEyeSlash size={20} />
              )}
            </button>
          </div>
        </div>

        {/* FORGET PASSWORD */}
        <div
          className="text-right mb-4 text-orange-400 font-medium cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forget Password ?{" "}
        </div>

        {/* Sign in button */}
        <button
          onClick={handleSignIn}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
        >
          Sign In
        </button>
        <p className="text-red-500 text-center my-9">{err}</p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleAuth}
          className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <FcGoogle size={20} />
          <span className="text-sm font-medium">Sign in with Google</span>
        </button>

        {/* Sign up */}
        <p
          onClick={() => navigate("/signup")}
          className="text-sm text-center mt-6 text-gray-500 cursor-pointer"
        >
          Want to create an account?{" "}
          <span className="text-orange-500 font-medium">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
