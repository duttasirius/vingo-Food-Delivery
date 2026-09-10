import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return;

    const fetchByShops = async () => {
      try {
        const result = await axios.get(
          `${serverurl}/api/shop/get-by-city/${encodeURIComponent(currentCity)}`,
          { withCredentials: true },
        );

        dispatch(setShopsInMyCity(result.data.shops || []));
      } catch (error) {
        console.log("SHOP FETCH ERROR:", error.response?.data || error.message);
      }
    };

    fetchByShops();
  }, [currentCity, dispatch]);
}

export default useGetShopByCity;
