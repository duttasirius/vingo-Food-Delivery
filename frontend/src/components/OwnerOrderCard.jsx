import React from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { serverurl } from "../App";

function OwnerOrderCard({ data }) {
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverurl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );

      console.log("order updated", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6 hover:shadow-lg transition duration-300">
      {/* ================= CUSTOMER INFO ================= */}
      <div className="border-b pb-4 space-y-2">
        <p className="text-lg font-semibold text-gray-800">
          {data?.user?.fullName || "No Name"}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MdEmail className="text-orange-500" />
          {data?.user?.email || "No Email"}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600">
          <FaPhoneAlt className="text-orange-500" />
          {data?.user?.mobile || "No Phone"}
        </p>
      </div>

      {/* ================= DELIVERY INFO ================= */}
      <div className="border-b pb-4 space-y-1">
        <p className="text-gray-700 font-medium">
          {data?.deliveryAddress?.text || "No address"}
        </p>

        <p className="text-xs text-gray-500">
          Lat: {data?.deliveryAddress?.latitude} | Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* ================= SHOP ORDERS ================= */}
      <div className="space-y-5">
        {data?.shopOrders?.map((shopOrder, shopIndex) => (
          <div
            key={shopIndex}
            className="bg-orange-50 border border-orange-100 rounded-xl p-5 space-y-4"
          >
            {/* ---- Header ---- */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <p className="font-semibold text-gray-800 flex items-center gap-1">
                Subtotal:
                <FaRupeeSign className="text-sm" />
                {shopOrder?.subTotal}
              </p>

              <div className="flex items-center gap-5">
                <span className="text-sm font-bold text-orange-500 ">
                  Status: {shopOrder.status}
                </span>

                <select
                  value={shopOrder.status}
                  onChange={(e) =>
                    handleUpdateStatus(
                      data._id,
                      shopOrder.shop?._id, // ← correct
                      e.target.value,
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out of delivery">Out of delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* ---- Items ---- */}
            <div className="space-y-3">
              {shopOrder?.shopOrderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <img
                    src={item?.item?.image}
                    alt={item?.name}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item?.name}</p>

                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      QTY: {item?.quantity} ×{" "}
                      <FaRupeeSign className="text-xs" />
                      {item?.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerOrderCard;
