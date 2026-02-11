import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverurl } from "../App";

import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShops() {
  // when i need to change the value useDispatch
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchShop();
  }, []);
}

export default useGetMyShops;
