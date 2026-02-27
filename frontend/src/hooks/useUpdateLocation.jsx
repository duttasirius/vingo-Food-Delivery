import axios from "axios";
import React, { useEffect } from "react";
import { serverurl } from "../App";
import { useDispatch, useSelector } from "react-redux";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const result = await axios.post(
        `${serverurl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true },
      );
      console.log(result.data);
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);

      // watchPosition continuously tracks the user's GPS location in real time.
      // It runs every time the device location changes (movement or GPS refresh).
      // `pos & coords`  is the position object returned by the browser's Geolocation API. coming from browser
      //
      // inside  pos.coords contains:
      //   - latitude  → user's current latitude
      //   - longitude → user's current longitude
      //
      // We send these coordinates to our backend using updateLocation function params( lat & lon)
      // so the server can store the user's latest location.
    });
  }, [userData]);
}

export default useUpdateLocation;
