import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import userGetCurrentUser from "./hooks/userGetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import CreateEditShop from "./pages/CreateEditShop";

export const serverurl = "http://localhost:8000";

const App = () => {
  const isLoading = userGetCurrentUser(); // ✅ return loading from hook
  useGetCity();

  const { userData } = useSelector((state) => state.user);

  // ✅ Wait for user fetch before deciding where to redirect
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <p className="text-orange-500 text-lg font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  if (!userData) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-edit-shop" element={<CreateEditShop />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
