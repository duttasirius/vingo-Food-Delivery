import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryDashboard from "../components/DeliveryDashboard";
import Nav from "../components/Nav";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  // ⛔ wait until userData exists
  if (!userData) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <SignIn />;
  }

  return (
    <div className="w-screen min-h-screen pt-[100px] flex flex-col items-center bg-gray-200">
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryDashboard />}
    </div>
  );
};

export default Home;
