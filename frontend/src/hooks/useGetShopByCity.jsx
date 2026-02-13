import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchByShops = async () => {
      try {
        const result = await axios.get(
          `${serverurl}/api/shop/get-by-city/${currentCity}`,
          { withCredentials: true },
        );

        console.log("this is currentcity shop data", result.data);
        dispatch(setShopsInMyCity(result.data.shops));
      } catch (error) {}
    };
    fetchByShops();
  }, [currentCity]);
}

export default useGetShopByCity;
