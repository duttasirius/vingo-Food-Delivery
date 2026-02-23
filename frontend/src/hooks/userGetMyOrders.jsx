import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setMyOrders } from "../redux/userSlice";

function userGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data.orders));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, [userData]);
}

export default userGetMyOrders;
