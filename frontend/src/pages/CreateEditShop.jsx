import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverurl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user,
  );

  const [name, setName] = useState("");
  const [address, setAddress] = useState(currentAddress || "");
  const [city, setCity] = useState(currentCity || "");
  const [state, setState] = useState(currentState || "");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Always fetch fresh shop data on mount
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/shop/get-my`, {
          withCredentials: true,
        });
        if (result.data.shop) {
          dispatch(setMyShopData(result.data.shop));
        }
      } catch (error) {
        console.log("FETCH ERROR:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  // ✅ Sync form fields when myShopData loads into Redux
  useEffect(() => {
    if (!myShopData) return;
    setName(myShopData.name || "");
    setAddress(myShopData.address || "");
    setCity(myShopData.city || "");
    setState(myShopData.state || "");
    setFrontendImage(myShopData.image || null);
  }, [myShopData]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverurl}/api/shop/create-edit`,
        formData,
        { withCredentials: true },
      );

      if (result.data.shop) {
        dispatch(setMyShopData(result.data.shop));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Show loader until fetch completes — prevents flicker
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <p className="text-orange-500 text-lg font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col p-6 bg-orange-50 min-h-screen relative">
      <div
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 mb-4 z-10"
      >
        <IoMdArrowRoundBack className="text-orange-500" size={35} />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-orange-600 w-16 h-16" />
          </div>
          <div className="text-3xl font-bold text-gray-700">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl"
        >
          {/* Shop Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Shop Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter your shop name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Shop Image
            </label>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="w-full text-sm border border-gray-300 rounded-lg 
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
              file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 
              hover:file:bg-orange-100"
            />
            {frontendImage && (
              <div className="mt-5">
                <img
                  src={frontendImage}
                  className="w-full object-cover h-48 rounded-lg border"
                  alt="shop"
                />
              </div>
            )}
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                onChange={(e) => setCity(e.target.value)}
                value={city}
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                State
              </label>
              <input
                onChange={(e) => setState(e.target.value)}
                value={state}
                type="text"
                placeholder="Enter your state"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Enter your shop address"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold
            shadow-md shadow-orange-600/20 hover:bg-orange-700 hover:shadow-lg 
            hover:shadow-orange-600/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Save Shop
          </button>
        </form>
      </div>

      {!myShopData && (
        <div className="flex justify-center items-center sm:p-6 p-5">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-orange-600 w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                ADD YOUR RESTAURANT
              </h2>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Welcome section — only renders after confirmed data, no flicker */}
      {myShopData && (
        <div className="flex flex-col items-center gap-4 p-6 w-full max-w-2xl">
          <div className="w-full bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {myShopData.name}
              </h2>
              <p className="text-gray-500 mt-1">{myShopData.address}</p>
              <p className="text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Edit Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEditShop;
