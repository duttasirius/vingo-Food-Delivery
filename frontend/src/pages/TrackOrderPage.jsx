import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverurl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch Order ----------------

  useEffect(() => {
    async function fetchOrder() {
      try {
        const result = await axios.get(
          `${serverurl}/api/order/get-order-by-id/${orderId}`,
          { withCredentials: true },
        );

        if (result.data.success) {
          setCurrentOrder(result.data.order);
        }
      } catch (error) {
        console.log("Error fetching order:", error);
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  // ---------------- Loading ----------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Loading order...
      </div>
    );
  }

  // ---------------- No Order ----------------

  if (!currentOrder) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        Order not found
      </div>
    );
  }

  // ---------------- Main Page ----------------

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-orange-600 cursor-pointer mb-6"
        >
          <IoIosArrowRoundBack size={30} />
          <h1 className="text-xl font-bold">Track Your Order</h1>
        </div>

        {/* Loop All Shop Orders */}
        {currentOrder.shopOrders.map((shopOrder, index) => {
          const deliveryBoy = shopOrder.assignedDeliveryBoy;

          // Check if delivery boy location exists
          let deliveryLat = null;
          let deliveryLon = null;

          if (deliveryBoy && deliveryBoy.location) {
            deliveryLat = deliveryBoy.location.coordinates[1];
            deliveryLon = deliveryBoy.location.coordinates[0];
          }

          // Customer location
          const customerLat = currentOrder.deliveryAddress.latitude;
          const customerLon = currentOrder.deliveryAddress.longitude;

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 mb-6"
            >
              {/* Shop Name */}
              <h2 className="text-lg font-semibold mb-2">
                {shopOrder.shop.name}
              </h2>

              {/* Items */}
              <p className="text-sm text-gray-600">
                Items:{" "}
                {shopOrder.shopOrderItems
                  .map((item) => item.item.name)
                  .join(", ")}
              </p>

              {/* Subtotal */}
              <p className="text-sm mt-1">Subtotal: ₹ {shopOrder.subTotal}</p>

              {/* Address */}
              <p className="text-sm mt-1">
                Address: {currentOrder.deliveryAddress.text}
              </p>

              {/* Delivery Info */}
              <div className="mt-4 border-t pt-4">
                {deliveryBoy ? (
                  <>
                    <p className="text-sm">
                      Delivery Boy: {deliveryBoy.fullName}
                    </p>
                    <p className="text-sm">Contact: {deliveryBoy.mobile}</p>
                  </>
                ) : (
                  <p className="text-yellow-600 text-sm">
                    Waiting for delivery partner...
                  </p>
                )}
              </div>

              {/* Show Map Only If Coordinates Exist */}
              {deliveryLat && deliveryLon && customerLat && customerLon && (
                <div className="mt-4">
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation: {
                        lat: deliveryLat,
                        lon: deliveryLon,
                      },
                      customerLocation: {
                        lat: customerLat,
                        lon: customerLon,
                      },
                    }}
                  />
                </div>
              )}

              {/* Delivered Message */}
              {shopOrder.status === "delivered" && (
                <div className="mt-4 text-green-600 font-semibold">
                  Order Delivered Successfully
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrackOrderPage;
