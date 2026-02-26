import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { serverurl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerOrderCard({ data }) {
  const [availableBoysMap, setAvailableBoysMap] = useState({});
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const res = await axios.post(
        `${serverurl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true },
      );

      dispatch(updateOrderStatus({ orderId, shopId, status }));

      // store available boys per shopOrder
      setAvailableBoysMap((prev) => ({
        ...prev,
        [shopId]: res.data.availableBoys || [],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
      {/* CUSTOMER */}
      <div className="border-b pb-4">
        <p className="text-lg font-semibold">{data?.user?.fullName}</p>
        <p className="text-sm text-gray-500 flex gap-2 items-center">
          <MdEmail /> {data?.user?.email}
        </p>
        <p className="text-sm text-gray-500 flex gap-2 items-center">
          <FaPhoneAlt /> {data?.user?.mobile}
        </p>
      </div>

      {/* ADDRESS */}
      <div className="border-b pb-4">
        <p>{data?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-400">
          {data?.deliveryAddress?.latitude}, {data?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* SHOP ORDERS */}
      {data?.shopOrders?.map((shopOrder) => {
        const availableBoys = availableBoysMap[shopOrder.shop?._id] || [];

        return (
          <div
            key={shopOrder._id}
            className="bg-orange-50 border rounded-xl p-5 space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <p className="font-semibold flex items-center gap-1">
                Subtotal <FaRupeeSign /> {shopOrder?.subTotal}
              </p>

              <div className="flex gap-4 items-center">
                <span className="text-orange-500 font-bold">
                  {shopOrder.status}
                </span>

                <select
                  value={shopOrder.status}
                  onChange={(e) =>
                    handleUpdateStatus(
                      data._id,
                      shopOrder.shop?._id,
                      e.target.value,
                    )
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out of delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* ITEMS */}
            {shopOrder?.shopOrderItems?.map((item) => (
              <div key={item._id} className="flex gap-3 bg-white p-3 rounded">
                <img
                  src={item?.item?.image}
                  className="w-14 h-14 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item?.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}

            {/* DELIVERY SECTION */}
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">
                Delivery Status
              </p>

              {/* 1️⃣ ASSIGNED RIDER */}
              {shopOrder.assignedDeliveryBoy ? (
                <div className="bg-green-50 border rounded-md px-3 py-2 mt-2">
                  🚚 Assigned:
                  <br />
                  {shopOrder.assignedDeliveryBoy.fullName} —{" "}
                  {shopOrder.assignedDeliveryBoy.mobile}
                </div>
              ) : availableBoys.length > 0 ? (
                /* 2️⃣ AVAILABLE RIDERS */
                availableBoys.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white border rounded-md px-3 py-2 mt-2"
                  >
                    {b.fullName} — {b.mobile}
                  </div>
                ))
              ) : (
                /* 3️⃣ WAITING */
                <p className="text-xs text-gray-400 mt-2">
                  Waiting for rider to accept…
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OwnerOrderCard;
