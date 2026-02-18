import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
      <FaCircleCheck className="text-green-600 text-6xl mb-5" />
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Placed</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Thank you for your purchase you can track your order in "My Orders"
        section
      </p>

      <button
        onClick={() => navigate("/my-orders")}
        className="bg-orange-500 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition"
      >
        Back to My Orders
      </button>
    </div>
  );
}

export default OrderPlaced;
