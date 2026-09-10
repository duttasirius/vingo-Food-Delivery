import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setItemsInMyCity } from "../redux/userSlice";

function userGetItemByCity() {
  const dispatch = useDispatch();
  const { currentCity, userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity || !userData?._id) return;

    const fetchItems = async () => {
      try {
        const results = await axios.get(
          `${serverurl}/api/item/get-by-city/${encodeURIComponent(currentCity)}`,
          { withCredentials: true },
        );

        console.log("this is useGetItemByCity api:", results.data);
        dispatch(setItemsInMyCity(results.data.items || []));
      } catch (error) {
        console.log("ITEM FETCH ERROR:", error.response?.data || error.message);
        dispatch(setItemsInMyCity([]));
      }
    };

    fetchItems();
  }, [currentCity, userData?._id, dispatch]);
}

export default userGetItemByCity;
