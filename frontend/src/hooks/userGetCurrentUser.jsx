import axios from "axios";
import React, { useEffect } from "react";
import { serverurl } from "../App";

const userGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverurl}/api/user/current`, {
          withCredentials: true,
        });

        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);
};

export default userGetCurrentUser;
