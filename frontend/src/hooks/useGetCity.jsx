import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentAddress,
  setCurrentCity,
  setcurrentState,
} from "../redux/userSlice.js";
import { setAddress, setLocation } from "../redux/mapSlice.js";

function useGetCity() {
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  // Creates a reference to Redux’s dispatch function, which lets your component send actions to the Redux store to update global stat
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // need to activate my pc location , getting my current location
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      const lattitude = position.coords.latitude;
      const longtitude = position.coords.longitude;

      dispatch(setLocation({ lat: lattitude, lon: longtitude }));

      // api coming from geoapify site  &&  map used reverse-geocoding-api
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longtitude}&format=json&apiKey=${apiKey}`,
      );

      // dispatch(setCurrentCity(result?.data.results[0].city));
      const resultData = result?.data?.results?.[0];

      const city =
        resultData?.city ||
        resultData?.town ||
        resultData?.village ||
        resultData?.municipality ||
        resultData?.district ||
        resultData?.county ||
        resultData?.suburb ||
        resultData?.state ||
        "Unknown";

      dispatch(setCurrentCity(city));
      dispatch(setcurrentState(result?.data.results[0].state));
      dispatch(setCurrentAddress(result?.data.results[0].formatted));
      dispatch(setAddress(result?.data.results[0].address_line2));
    });
  }, [userData]);
}

export default useGetCity;
