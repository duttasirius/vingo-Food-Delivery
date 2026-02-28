import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserOrderCard({ data }) {
  // this func trun backend timestamps into redable format date/month/year
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 space-y-5 hover:shadow-lg transition">
      {/* header */}
      <div className="flex justify-between items-start border-b pb-3">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Order #
            <span className="font-semibold text-gray-800 ml-1">
              {data._id.slice(-6)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Date:
            <span className="ml-1 text-gray-700">
              {formatDate(data.createdAt)}
            </span>
          </p>
        </div>

        <div className="text-right space-y-1">
          <p className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold inline-block">
            {data.paymentMethod?.toUpperCase()}
          </p>
          {/* because we have status inside shoporderSchema & its parent schema is shopOrders  shopOrders: [shopOrderSchema], */}
          <p className="text-sm font-medium text-gray-700">
            Status:
            <span className="ml-1 text-orange-600 font-semibold">
              {data?.shopOrders?.[0]?.status}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* inside data coming from redux i've shopOrders array which contain details - owner, shop , item orderd */}
        {data.shopOrders.map((shopOrder, index) => (
          <div
            className="bg-orange-50 border border-orange-100 rounded-xl p-4 space-y-4"
            key={index}
          >
            <p className="font-semibold text-gray-800 text-lg">
              {shopOrder.shop.name}
            </p>

            {/* evething contain an array inside "shopOrders" inside "shopOrders" an array names "shopOrdersItems" where stored item price name quantity as per Order model  */}
            <div className="space-y-3">
              {shopOrder.shopOrderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <img
                    src={item.item?.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      QTY: {item.quantity} X <FaRupeeSign />
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm pt-2 border-t">
              <p className="text-gray-600">
                Subtotal:
                <span className="ml-1 font-semibold text-gray-800">
                  ₹{shopOrder.subTotal}
                </span>
              </p>
              <p className="text-gray-600">
                Status:
                <span className="ml-1 font-semibold text-orange-600">
                  {shopOrder.status}
                </span>
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-3 border-t">
          <p className="text-lg font-bold text-gray-800">
            Total: ₹{data.totalAmount}
          </p>
          <button
            onClick={() => navigate(`/track-order/${data._id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserOrderCard;
