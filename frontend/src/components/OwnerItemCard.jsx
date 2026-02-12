import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverurl } from "../App";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

// data coming from ownerdashboard.jsx part
const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  console.log("ITEM DATA:", data);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const result = await axios.get(
        `${serverurl}/api/item/delete/${data._id}`,
        { withCredentials: true },
      );

      if (result.data.success) {
        dispatch(setMyShopData(result.data.shop));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
      <div className="w-36 flex-shrink-0 bg-gray-50">
        <img src={data.image} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between p-3">
        <div>
          <h2 className="text-base font-semibold text-orange-600">
            {data.name}
          </h2>

          <p>
            <span className="font-medium text-gray-700">Category:</span>{" "}
            {data.category}
          </p>

          <p>
            <span className="font-medium text-gray-700">Food Type:</span>{" "}
            {data.foodType}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-medium text-gray-700">Price:</span> ₹
            {data.price}
          </div>

          <div
            onClick={() => navigate(`/edit-item/${data._id}`)}
            className="cursor-pointer text-blue-500 hover:scale-110 transition"
          >
            <FaPen />
          </div>

          <div
            onClick={handleDelete}
            className="cursor-pointer text-red-500 hover:scale-110 transition"
          >
            <FaTrash />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
