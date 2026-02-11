import React from "react";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useGetMyShops from "../hooks/useGetMyShops";

function OwnerDashboard() {
  useGetMyShops();

  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-amber-50 pt-20">
      <Nav />

      {/* No shop yet */}
      {!myShopData && (
        <div className="flex justify-center items-center sm:p-6 p-5">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-orange-600 w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                ADD YOUR RESTAURANT
              </h2>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Shop exists — show it */}
      {myShopData && (
        <div className="flex flex-col items-center gap-4 p-6 w-full max-w-2xl">
          <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {myShopData.name}
              </h2>
              <p className="text-gray-500 mt-1">{myShopData.address}</p>
              <p className="text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Edit Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
