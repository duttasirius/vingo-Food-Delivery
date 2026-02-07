import axios from "axios";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../App";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    console.log("SEND OTP CLICKED");

    try {
      const result = await axios.post(
        `${serverurl}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );

      console.log("API RESULT:", result.data);
      setStep(2);
    } catch (error) {
      console.log("API ERROR:", error.response?.data || error.message);
    }
  };

  const handleVerifyOtp = async () => {
    console.log("VERIFY CLICKED");

    try {
      const result = await axios.post(`${serverurl}/api/auth/verify-otp`, {
        email,
        otp,
      });

      console.log("VERIFY RESPONSE:", result.data);

      setStep(3);
    } catch (error) {
      console.log("VERIFY ERROR:", error.response?.data || error.message);
    }
  };

  /// NEW PART

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      console.log("password mismatch");
      return;
    }

    console.log("RESET CLICKED");

    try {
      const result = await axios.post(`${serverurl}/api/auth/reset-password`, {
        email,
        newPassword,
      });

      console.log("RESET RESPONSE:", result.data);
      navigate("/signin");
    } catch (error) {
      console.log("RESET ERROR:", error.response?.data);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center gap-4 mb-4">
          <IoArrowBack
            onClick={() => navigate("/signin")}
            size={30}
            className="bg-orange-400 cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-center cursor-pointer  text-orange-400">
            Foreget Password
          </h1>
        </div>

        {/* STEP 1  */}

        {step === 1 && (
          <div>
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
            <button
              onClick={handleSendOtp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
            >
              Send otp
            </button>
          </div>
        )}

        {/* STEP 2  */}
        {step === 2 && (
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Enter otp
              </label>
              <input
                type="email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
            >
              Verify otp
            </button>
          </div>
        )}

        {/* step 3  */}

        {step === 3 && (
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="email"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                confirm Password
              </label>
              <input
                type="email"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" Confirm password"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
