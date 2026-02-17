import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <IoIosArrowRoundBack size={30} className="text-[#ff4d2d]" />
          </button>

          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        </div>

        {/* EMPTY CART */}
        {cartItems?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e84324] transition"
            >
              Browse Items
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* CART ITEMS */}
            <div className="flex flex-col gap-3">
              {cartItems.map((item) => (
                <CartItemCard data={item} key={item.id} />
              ))}
            </div>

            {/* TOTAL SECTION */}
            <div className="mt-6 bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Amount</p>
                <h2 className="text-xl font-bold text-gray-800">
                  ₹{totalAmount}
                </h2>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-3 bg-[#ff4d2d] text-white rounded-xl font-semibold hover:bg-[#e84324] active:scale-95 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
