import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
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
          {/* div 1  */}
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-orange-600 w-16 h-16" />
          </div>
          {/* div 2 */}
          <div className="text-3xl font-bold text-gray-700">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        {/* ADD SHOP FORM SECTION  */}
        <form className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 max-w-xl">
          {/* Shop Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              placeholder="Enter your shop name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
      transition"
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm border border-gray-300 rounded-lg 
      file:mr-4 file:py-2 file:px-4 
      file:rounded-lg file:border-0 
      file:text-sm file:font-semibold 
      file:bg-orange-50 file:text-orange-600 
      hover:file:bg-orange-100"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
        transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                State
              </label>
              <input
                type="text"
                placeholder="Enter your state"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
        transition"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your shop address"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 
      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
      transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold
    shadow-md shadow-orange-600/20
    hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30
    active:scale-[0.98]
    transition-all duration-200 cursor-pointer"
          >
            Save Shop
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;
