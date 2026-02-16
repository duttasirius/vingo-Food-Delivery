import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeCartItem, updateQuantity } from "../redux/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-xl border"
        />

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-800">{data.name}</h1>

          <p className="text-xs text-gray-500">
            ₹{data.price} × {data.quantity}
          </p>

          <p className="text-sm font-bold text-green-600 mt-1">
            ₹{data.price * data.quantity}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {/* Quantity controller */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={() => handleDecrease(data.id, data.quantity)}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 active:scale-95 transition"
          >
            <FaMinus size={12} />
          </button>

          <span className="px-4 text-sm font-semibold text-gray-800">
            {data.quantity}
          </span>

          <button
            onClick={() => handleIncrease(data.id, data.quantity)}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 active:scale-95 transition"
          >
            <FaPlus size={12} />
          </button>
        </div>

        {/* Delete button */}
        <button
          onClick={() => dispatch(removeCartItem(data.id))}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}

export default CartItemCard;
