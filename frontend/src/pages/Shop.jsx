import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverurl } from "../App";
import { FaStore } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import FoodCard from "../components/FoodCard";
import { FaArrowLeft } from "react-icons/fa";

function Shop() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${serverurl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true },
      );

      setShop(result.data.shop);
      setItems(result.data.items);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-md transition cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft />
        Back
      </button>
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={shop.image}
            className="w-full h-full object-cover"
            alt={shop.name}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <FaLocationDot size={20} className="text-red-500" />
              <p className="text-lg font-medium text-gray-200">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="flex items-center text-center gap-2 text-2xl font-bold text-gray-800 mb-8">
          <MdRestaurantMenu className="text-orange-500 text-3xl" />
          OUR MENU
        </h2>

        {items.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-lg">
            NO ITEMS AVAILABLE
          </p>
        )}
      </div>
    </div>
  );
}

export default Shop;
