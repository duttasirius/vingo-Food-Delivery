import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverurl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { useLocation } from "react-router-dom";

function useGetMyShops() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // 🔥 ONLY run on home/dashboard
    console.log("CURRENT PATH:", location.pathname);
    if (location.pathname !== "/") return;

    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/shop/get-my`, {
          withCredentials: true,
        });
        console.log("SHOP RESPONSE:", result.data); // 👈
        if (result.data.shop) {
          dispatch(setMyShopData(result.data.shop));
          console.log("DISPATCHED:", result.data.shop); // 👈
        } else {
          console.log("NO SHOP KEY — got:", result.data); // 👈
        }
      } catch (error) {
        console.log("HOOK ERROR:", error.response?.data || error.message); // 👈
      }
    };

    fetchShop();
  }, [location.pathname]);
}

export default useGetMyShops;
