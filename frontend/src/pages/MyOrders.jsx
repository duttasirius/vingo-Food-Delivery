import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OwnerOrderCard from "../components/OwnerOrderCard";
import UserOrderCard from "../components/UserOrderCard";

function MyOrders() {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6 md:p-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition shadow-sm"
          >
            <IoIosArrowRoundBack size={28} />
          </button>

          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            My Orders
          </h1>
        </div>

        {/* ================= ORDERS LIST ================= */}
        <div className="space-y-6">
          {Array.isArray(myOrders) && myOrders.length > 0 ? (
            myOrders.map((order, index) =>
              userData?.role === "user" ? (
                <UserOrderCard key={order._id || index} data={order} />
              ) : userData?.role === "owner" ? (
                <OwnerOrderCard key={order._id || index} data={order} />
              ) : null,
            )
          ) : (
            <div className="text-center py-16 border border-dashed rounded-2xl bg-orange-50">
              <p className="text-gray-500 text-lg font-medium">
                No orders found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Your orders will appear here once placed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
