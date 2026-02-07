import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";

export const serverurl = "http://localhost:8000";

const App = () => {
  return (
    <Routes>
      {/* DEFAULT ROOT ROUTE */}
      <Route path="/" element={<Navigate to="/signin" />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
