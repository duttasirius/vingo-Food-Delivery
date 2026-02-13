import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverurl } from "../App";
import { setItemsInMyCity } from "../redux/userSlice";

function userGetItemByCity() {
  const dispatch = useDispatch();
  const { currentCity } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentCity) return;

    const fetchItems = async () => {
      try {
        const results = await axios.get(
          `${serverurl}/api/item/get-by-city/${currentCity}`,
          { withCredentials: true },
        );

        console.log("this is usegetitembycity api:", results.data);

        // store only items array in redux
        dispatch(setItemsInMyCity(results.data.items));
      } catch (error) {
        console.log(error);
      }
    };

    fetchItems();
  }, [currentCity]);
}

export default userGetItemByCity;
