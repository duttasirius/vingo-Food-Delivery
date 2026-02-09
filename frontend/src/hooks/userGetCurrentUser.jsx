import axios from "axios";
import { useEffect } from "react";
import { serverurl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/user/current`, {
          withCredentials: true,
        });

        console.log("API USER:", result.data.user);

        // IMPORTANT FIX
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.log("Not logged in");
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;
