import React, { useState } from "react";
import {
  FaLeaf,
  FaDrumstickBite,
  FaStar,
  FaRegStar,
  FaShoppingCart,
} from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const { cartItems } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  console.log("cartItems:", cartItems);

  // ------------------------------------------------------------
  // FUNCTION: renderStar
  // PURPOSE: Show star icons based on rating number (0–5)
  // This function DOES NOT update rating — it only displays stars
  // ------------------------------------------------------------

  // rating → number coming from backend (example: 3, 4, 5)
  const renderStar = (rating) => {
    // create empty array to store star icons
    const stars = [];

    // loop runs 5 times because rating system is out of 5 stars
    for (let i = 1; i <= 5; i++) {
      // if current position (i) is less than or equal to rating
      // show filled star ⭐
      // otherwise show empty star ☆
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-300 text-lg" /> // filled star
        ) : (
          <FaRegStar className="text-yellow-300 text-lg" /> // empty star
        ),
      );
    }

    // return array of stars so React can display them
    return stars;
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="w-[250px] gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* IMAGE */}
      <div className="relative w-full h-[170px] overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* VEG / NONVEG ICON */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full shadow p-1">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-sm" />
          ) : (
            <FaDrumstickBite className="text-red-500 text-sm" />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
          {data.name}
        </h2>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1">
          {renderStar(data?.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            ({data?.rating?.count || 0})
          </span>
        </div>

        {/* PRICE + ACTION */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-bold text-gray-900 text-lg">₹{data.price}</span>

          {/* QUANTITY CONTROL */}
          <div className="flex items-center bg-gray-50 border rounded-full shadow-sm overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-2 py-1 hover:bg-gray-200 transition"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-2 text-sm font-medium">{quantity}</span>

            <button
              onClick={handleIncrease}
              className="px-2 py-1 hover:bg-gray-200 transition"
            >
              <FaPlus size={12} />
            </button>

            {/* ADD TO CART */}
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    shop: data.shop,
                    quantity,
                    foodType: data.foodType,
                  }),
                )
              }
              className={`${cartItems?.some((i) => i.id == data._id) ? "bg-gray-800" : "bg-orange-500"}  hover:bg-orange-600 text-white px-3 py-2 flex items-center justify-center`}
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
