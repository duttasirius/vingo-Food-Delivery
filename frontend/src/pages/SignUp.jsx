import React, { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverurl } from "../App";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const result = await axios.post(
        `${serverurl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true },
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-orange-500 mb-2">VINGO</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Create your account to order delicious food at your doorstep
        </p>

        {/* Full name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="relative mt-1">
            <input
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

        {/* Role */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Role</label>

          <div className="flex gap-2 mt-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-2 rounded-lg text-sm border transition 
                ${
                  role === r
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-orange-400 text-gray-700 hover:bg-orange-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sign up button */}
        <button
          onClick={handleSignUp}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google */}
        <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <FcGoogle size={20} />
          <span className="text-sm font-medium">Sign up with Google</span>
        </button>

        {/* Sign in */}
        <p
          onClick={() => navigate("/signin")}
          className="text-sm text-center mt-6 text-gray-500 cursor-pointer"
        >
          Already have an account?{" "}
          <span className="text-orange-500 font-medium">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
