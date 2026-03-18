import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { serverurl } from "../App";
import { Handler } from "leaflet";

// 🗺️ RecenterMap component
// Purpose: Whenever location in Redux changes,
// this component recenters the Leaflet map to that location.
//
// How it works:
// - useMap() gives access to Leaflet map instance
// - map.setView() moves camera to new coordinates

//
// This component renders nothing (return null)
// It only performs a side-effect on the map.
function RecenterMap({ location }) {
  const map = useMap();

  // Recenter map to new Redux location
  map.setView([location.lat, location.lon], 16, { animate: true });

  return null;
}

function CheckOut() {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const navigate = useNavigate();
  const deliveryFee = totalAmount > 500 ? 0 : 50;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  // 🔴 Runs when the map marker drag ends
  // - Leaflet sends an event object `e`
  // - e.target is the dragged marker
  // - _latlng contains the marker’s new coordinates
  // - We extract latitude & longitude from it
  // - Then dispatch to Redux so global state updates
  const onDrangEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    // Dispatch new coordinates to Redux store
    // NOTE: Leaflet uses `lng`, but our store uses `lon`
    dispatch(setLocation({ lat, lon: lng }));

    getAddressByLatLng(lat, lng);
    // Fetch readable address for the new marker position.
    // We call this after dragging ends so whenever coordinates change,
    // the app updates the address (city/street) based on the new lat & lon.
    // Without this, Redux would have new coordinates but the address would stay old.
  };

  const getCurrentLocation = () => {
    // need this properties to getting curret location
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Save coordinates to Redux
      // lat long coming from redux -- mapslice -- location
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      // need this to update the search bar address
      getAddressByLatLng(latitude, longitude);
    });
  };

  // ------------------------ NEW NOTES------------------

  const getAddressByLatLng = async (lat, lng) => {
    // 🌍 Reverse geocoding: convert coordinates → address
    // We pass `lat` and `lng` into this function from Leaflet.
    //
    // Why use `lat` & `lon` in the API URL?
    // - Leaflet gives coordinates as: lat (latitude) & lng (longitude)
    // - Geoapify API expects: lat (latitude) & lon (longitude)
    // - `lng` and `lon` mean the same thing → longitude
    // - So we keep `lat` as is, and send `lng` as `lon` in the API request
    try {
      const result = await axios.get(
        // Geoapify requires: lat=<latitude> & lon=<longitude> || in redux mapslice i use lattitude - lat & longtitude-lon
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`,
      );
      dispatch(setAddress(result?.data.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  // ***************************************************

  const getLatLngByAddress = async () => {
    // 🔎 Convert typed address → latitude & longitude
    // - User types an address in the input field
    // - We send that text to Geoapify forward-geocoding API
    // - API returns coordinates (lat, lon) for that address
    // - We then save those coordinates to Redux
    // - Map + marker will update based on new location
    try {
      const result = await axios.get(
        // encodeURIComponent prevents errors from spaces/special characters
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );

      console.log(result);

      // Extract coordinates from API response
      const { lat, lon } = result.data.features[0].properties;

      // Save coordinates to Redux store
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const handelPlaceOrder = async () => {
    try {
      const result = await axios.post(
        `${serverurl}/api/order/place-order`,
        {
          paymentMethod,
          totalAmount,
          cartItems,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon,
          },
        },
        { withCredentials: true },
      );

      if (paymentMethod === "cod") {
        console.log(result.data);
        navigate("/order-placed");
      } else {
        // orderId & razororder coming from backend
        const orderId = result.data.orderId;
        // razorOrder created when user click pay now razorpay created an Id
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // this varibale processing & verifying the payment
  const openRazorpayWindow = (orderId, razorOrder) => {
    // "razororder" is from backend when the popup window open its create a razorpay._id that razororder id saved backend & send to frontend

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Vingo Food delivery App",
      description: "Food Delivery website",
      order_id: razorOrder.id,

      method: {
        card: true,
        upi: true,
        netbanking: true,
        wallet: true,
      },

      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverurl}/api/order/verify-payments`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true },
          );
          if (result.data.success) {
            navigate("/order-placed");
          }
        } catch (error) {
          console.log(error);
        }
      },
    };

    // new window.Razorpay(options) creates the payment instance that lets you open and control the Razorpay checkout UI 1st step
    const rzp = new window.Razorpay(options);

    // 2nd step this line open razorpay popup
    rzp.open();
  };

  useEffect(() => {
    setAddressInput(address || "");
  }, [address]);
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-4 py-8 relative">
      <div onClick={() => navigate("/")} className="z-10 absolute top-5 left-5">
        <button className="p-1 rounded-full hover:bg-red-100 transition">
          <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        </button>
      </div>

      <div className="w-full max-w-225 bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Checkout
        </h1>

        {/* MAP SECTION  */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FaLocationDot size={20} className="text-orange-500" />
            Delivery Location
          </h2>

          <div className="flex items-center gap-2">
            <input
              onChange={(e) => setAddressInput(e.target.value)}
              value={addressInput || ""}
              type="text"
              placeholder="Enter Your Delivery Address"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />

            <button
              onClick={getLatLngByAddress}
              className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              <FaSearch />
            </button>

            <button
              onClick={getCurrentLocation}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700"
            >
              <BiCurrentLocation />
            </button>
          </div>

          <div className="w-full h-[350px] md:h-[420px] rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
              center={[location?.lat, location?.lon]}
              zoom={17}
              className="w-full h-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap location={location} />
              <Marker
                position={[location?.lat, location?.lon]}
                draggable
                eventHandlers={{ dragend: onDrangEnd }}
              />
            </MapContainer>
          </div>
        </section>

        {/* PAYMENT-METHOD SECTION  */}
        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* cod div */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              {/* inline-flex container only occupies the width required by its content. */}
              <span className="inline-flex h-10 w-10  items-center justify-center rounded-full bg-green-300">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-xs text-gray-600">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            {/* online pay div  */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex items-center justify-center rounded-full h-10 w-10">
                <FaMobileAlt className="text-purple-600 text-lg" />
              </span>
              <span className="inline-flex items-center justify-center rounded-full h-10 w-10">
                <FaRegCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPO/CREDIT-CARD/DEBIT-CARD
                </p>
                <p className="text-xs text-gray-500">Paye Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 text-gray-800">
            order Summery
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-800"
              >
                <span>
                  {item.name} X {item.quantity}
                </span>
                <span className="flex gap-1">
                  <FaIndianRupeeSign />
                  {item.price * item.quantity}
                </span>
              </div>
            ))}
            <hr className="border-gray-200 my-2" />
            <div className="flex justify-between font-medium text-shadow-gray-700">
              <span>Subtotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between font-medium text-shadow-gray-600">
              <span>delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 text-orange-600">
              <span>Total</span>
              <span>{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        <button
          onClick={handelPlaceOrder}
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold"
        >
          {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
