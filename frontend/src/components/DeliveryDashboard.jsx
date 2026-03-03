import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import axios from "axios";
import { serverurl } from "../App";
import { FaIndianRupeeSign } from "react-icons/fa6";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

function DeliveryDashboard() {
  const { userData } = useSelector((state) => state.user);

  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  // ---------------------------
  // Fetch Available Assignments
  // ---------------------------
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverurl}/api/order/get-assignments`, {
        withCredentials: true,
      });

      if (result.data.success) {
        setAvailableAssignments(result.data.formatted || []);
      }
    } catch (error) {
      console.log(
        "GET ASSIGNMENTS ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  // ---------------------------
  // Accept Order
  // ---------------------------
  // coming from getCurrentOrder controller
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverurl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true },
      );

      if (result.data.success) {
        // Refresh both states
        getAssignments();
        getCurrentOrder();
      }
    } catch (error) {
      console.log("ACCEPT ORDER ERROR:", error.response?.data || error.message);
    }
  };

  // ---------------------------
  // Fetch Current Active Order
  // ---------------------------
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverurl}/api/order/get-current-order`,
        { withCredentials: true },
      );

      if (result.data.success) {
        setCurrentOrder(result.data);
        console.log(result.data);
      } else {
        setCurrentOrder(null);
      }
    } catch (error) {
      console.log(
        "GET CURRENT ORDER ERROR:",
        error.response?.data || error.message,
      );
    }
  };

  const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverurl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverurl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  // ---------------------------
  // Load Data On Login
  // ---------------------------
  useEffect(() => {
    if (!userData) return;

    getAssignments();
    getCurrentOrder();
  }, [userData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center">
      <Nav />

      <div className="mt-[100px] w-full max-w-[900px] px-4 flex flex-col gap-6">
        {/* ---------------- Header ---------------- */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-orange-600">
            Welcome, {userData?.fullName}
          </h1>

          <p className="text-sm text-gray-500">
            Lat: {userData?.location?.coordinates?.[1]} | Lng:{" "}
            {userData?.location?.coordinates?.[0]}
          </p>
        </div>

        {/* ---------------- Current Active Order ---------------- */}
        {currentOrder && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-200 p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-green-600">
              🚚 Current Active Delivery
            </h2>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Order ID: {currentOrder._id}
              </span>

              <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="text-sm text-gray-700">
              <p>
                <strong>Customer:</strong> {currentOrder.user?.fullName}
              </p>
              <p>
                <strong>Mobile:</strong> {currentOrder.user?.mobile}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <strong>Address:</strong> {currentOrder.deliveryAddress?.text}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentOrder.shopOrder?.shopOrderItems?.map((item) => (
                <span
                  key={item._id}
                  className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                >
                  {item.name} × {item.quantity}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-gray-700">Total Amount</p>

              <div className="flex items-center gap-1 text-lg font-bold text-orange-600">
                <FaIndianRupeeSign className="text-base" />
                {currentOrder.shopOrder?.subTotal}
              </div>
            </div>

            <div>
              {/* need to understand this  */}
              {userData?.location?.coordinates &&
                currentOrder?.deliveryAddress?.latitude &&
                currentOrder?.deliveryAddress?.longitude && (
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation: {
                        lat: userData.location.coordinates[1],
                        lon: userData.location.coordinates[0],
                      },
                      customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude,
                      },
                    }}
                  />
                )}
              {!showOtpBox ? (
                <button
                  className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-300"
                  onClick={sendOtp}
                >
                  Mark As Delivered
                </button>
              ) : (
                <div className="mt-4 p-4  border rounded-xl bg-orange-50">
                  <p>
                    Enter OTP send to{" "}
                    <span className="text-orange-500">
                      {currentOrder.user.fullName}
                    </span>
                  </p>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    type="text"
                    className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none  focus:ring-2 focus:ring-orange-400"
                    placeholder="ENTER OTP"
                  />
                  <button
                    onClick={verifyOtp}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    Submit OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- Available Orders ---------------- */}
        {!currentOrder && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Available Orders
            </h2>

            {availableAssignments.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-400">
                No orders available right now
              </div>
            )}

            {availableAssignments.map((a) => (
              <div
                key={a.assignmentId}
                className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 flex flex-col gap-3 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-orange-600">
                    {a.shopName}
                  </h3>

                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ₹{a.subTotal}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">
                  {a.deliveryAddress?.text}
                </p>

                <div className="flex flex-wrap gap-2">
                  {a.items?.map((item) => (
                    <span
                      key={item._id}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                    >
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {a.items?.length || 0} items
                  </span>

                  <button
                    onClick={() => acceptOrder(a.assignmentId)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
                  >
                    Accept Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
