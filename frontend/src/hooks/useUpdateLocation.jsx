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

// import axios from "axios";
// import { useEffect } from "react";
// import { serverurl } from "../App";
// import { useSelector } from "react-redux";

// function useUpdateLocation() {
//   const { userData } = useSelector((state) => state.user);

//   useEffect(() => {
//     // ❗ Do not run if user is not logged in
//     if (!userData) return;

//     // Update location to backend
//     const updateLocation = async (lat, lon) => {
//       try {
//         const result = await axios.post(
//           `${serverurl}/api/user/update-location`,
//           { lat, lon },
//           { withCredentials: true }
//         );

//         console.log("Location updated:", result.data);
//       } catch (error) {
//         console.log("UPDATE LOCATION ERROR:", error.response?.data || error.message);
//       }
//     };

//     // Start watching user location
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         updateLocation(pos.coords.latitude, pos.coords.longitude);

//         // watchPosition continuously tracks the user's GPS location in real time.
//         // It runs every time the device location changes (movement or GPS refresh).
//         // `pos & coords`  is the position object returned by the browser's Geolocation API. coming from browser
//         //
//         // inside  pos.coords contains:
//         //   - latitude  → user's current latitude
//         //   - longitude → user's current longitude
//         //
//         // We send these coordinates to our backend using updateLocation function params( lat & lon)
//         // so the server can store the user's latest location.
//       },
//       (error) => {
//         console.log("Geolocation Error:", error.message);
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 10000, // reuse location for 10 sec
//       }
//     );

//     // ✅ Cleanup: stop watching when component unmounts
//     return () => {
//       navigator.geolocation.clearWatch(watchId);
//     };

//   }, [userData]);
// }

// export default useUpdateLocation;
