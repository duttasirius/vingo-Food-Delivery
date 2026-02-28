import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverurl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";

function TrackOrderPage() {
  const { orderId } = useParams();

  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverurl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true },
      );

      console.log(result.data);
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);
  return (
    <div>
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        <h1>Track Your Order</h1>
      </div>
    </div>
  );
}

export default TrackOrderPage;
