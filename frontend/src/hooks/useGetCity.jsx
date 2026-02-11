import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setState } from "../redux/userSlice.js";

function useGetCity() {
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  // Creates a reference to Redux’s dispatch function, which lets your component send actions to the Redux store to update global stat
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      const lattitude = position.coords.latitude;
      const longtitude = position.coords.longitude;

      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longtitude}&format=json&apiKey=${apiKey}`,
      );

      console.log(result?.data.results[0].city);
      console.log(result);
      dispatch(setCity(result?.data.results[0].city));
      dispatch(setState(result?.data.results[0].state));
      console.log(result?.data.results[0].state);
    });
  }, [userData]);
}

export default useGetCity;
