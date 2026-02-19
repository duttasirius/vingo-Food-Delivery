import React from "react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaRupeeSign } from "react-icons/fa";

function OwnerOrderCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6 hover:shadow-lg transition">
      {/* ================= CUSTOMER INFO ================= */}
      <div className="border-b pb-4 space-y-2">
        {/* schema structure - inside "ORDERSCHMEA" have  {user } so we can acces it with only data.user & we make Schema to a particlaur model (user) so we can acces therir phone email etc */}
        <p className="text-lg font-semibold text-gray-800">
          {data?.user?.fullName}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600">
          <MdEmail className="text-orange-500" />
          {data?.user?.email}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-600">
          <FaPhoneAlt className="text-orange-500" />
          {data?.user?.mobile}
        </p>
      </div>

      {/* ================= DELIVERY INFO ================= */}
      <div className="border-b pb-4 space-y-2">
        <p className="text-gray-700 font-medium">
          {data?.deliveryAddress?.text}
        </p>

        <p className="text-sm text-gray-500">
          {/* ref: checkout page during order location save lat & long send from frontend  */}
          Lat: {data?.deliveryAddress?.latitude} | Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="space-y-4">
        {data?.shopOrders?.map((shopOrder, shopIndex) => (
          <div
            key={shopIndex}
            className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">
                Subtotal: ₹{shopOrder?.subTotal}
              </p>
              <p className="text-sm font-medium text-orange-600 capitalize">
                {shopOrder?.status}
              </p>
            </div>

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
                      QTY: {item?.quantity} X <FaRupeeSign />
                      {item?.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div></div>
    </div>
  );
}

export default OwnerOrderCard;
