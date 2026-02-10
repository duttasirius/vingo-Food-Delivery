import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import userGetCurrentUser from "./hooks/userGetCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import useGetCity from "./hooks/useGetCity";

export const serverurl = "http://localhost:8000";

// 4 hours 12 min need to complete

const App = () => {
  userGetCurrentUser();
  useGetCity();

  // Getting user data from Redux store

  // useSelector = React-Redux hook to read data from global store
  // state => state.user = selects the "user" slice from Redux state
  // { userData } = destructuring → takes only userData from that slice
  // Component will auto re-render if userData changes in Redux
  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      {/* FIX: redirect old /login */}
      <Route path="/login" element={<Navigate to="/signin" />} />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />

      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
