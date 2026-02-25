import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import axios from "axios";
import { serverurl } from "../App";

function DeliveryDashboard() {
  const { userData } = useSelector((state) => state.user);
  const [availableAssingments, setAvailableAssingments] = useState([]);

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverurl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssingments(result.data.formatted);
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (userData?._id) getAssignments();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center">
      <Nav />

      <div className="mt-[100px] w-full max-w-[900px] px-4 flex flex-col gap-6">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-orange-600">
            Welcome, {userData?.fullName}
          </h1>

          <p className="text-sm text-gray-500">
            Lat: {userData?.location?.coordinates?.[0]} | Lng:{" "}
            {userData?.location?.coordinates?.[1]}
          </p>
        </div>

        {/* Orders Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Available Orders
          </h2>

          {availableAssingments.length === 0 && (
            <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-400">
              No orders available right now
            </div>
          )}

          {availableAssingments.map((a) => (
            <div
              key={a.assignmentId}
              className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 flex flex-col gap-3 hover:shadow-lg transition"
            >
              {/* Top row */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-orange-600">
                  {a.shopName}
                </h3>

                <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                  ₹{a.subTotal}
                </span>
              </div>

              {/* Address */}
              <p className="text-gray-600 text-sm">{a.deliveryAddress?.text}</p>

              {/* Items */}
              <div className="flex flex-wrap gap-2">
                {a.items.map((item) => (
                  <span
                    key={item._id}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                  >
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {a.items.length} items
                </span>

                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow">
                  Accept Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeliveryDashboard;
