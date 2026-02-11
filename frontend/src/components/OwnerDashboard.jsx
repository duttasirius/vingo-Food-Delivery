import React from "react";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-amber-50 pt-20">
      <Nav />

      {!myShopData && (
        <div className="flex justify-center items-center sm:p-6 p-5 ">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-300  hover:shadow-xl transition-shadow duration-300">
            {" "}
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-orange-600 w-16 h-16 mb-4" />
              <h2 className=" text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                ADD YOUR RESTURENT
              </h2>
              <p className="text-base text-gray-600 mb-4">
                Join our food delivery platform & reach thousand of hungry
                customer everyday
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="relative inline-flex items-center justify-center 
px-8 py-3 text-white font-semibold 
rounded-full 
bg-gradient-to-r from-orange-400 to-orange-600 
hover:from-orange-600 hover:to-orange-700 
shadow-lg shadow-orange-500/30 
hover:shadow-orange-500/50 
active:scale-[0.96] 
transition-all duration-300 
focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
