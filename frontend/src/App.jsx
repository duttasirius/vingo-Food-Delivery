import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import userGetCurrentUser from "./hooks/userGetCurrentUser";

export const serverurl = "http://localhost:8000";

// 4 hours 12 min need to complete

const App = () => {
  userGetCurrentUser();
  return (
    <Routes>
      {/* DEFAULT ROOT ROUTE */}

      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default App;
