import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryDashboard from "../components/DeliveryDashboard";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();

  // wait for user
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryDashboard />}
    </div>
  );
};

export default Home;
