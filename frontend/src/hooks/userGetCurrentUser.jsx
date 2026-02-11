import axios from "axios";
import { useEffect, useState } from "react";
import { serverurl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const userGetCurrentUser = () => {
  // ✅ name matches your import
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data.user));
      } catch (error) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  return loading; // ✅ this is what was missing
};

export default userGetCurrentUser;
