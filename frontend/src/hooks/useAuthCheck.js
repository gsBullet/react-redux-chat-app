import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const useAuthChecked = () => {
  const dispath = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      const auth = JSON.parse(token);
      if (auth.accessToken) {
        dispath(
          userLoggedIn({
            accessToken: auth.accessToken,
            user: auth.user,
          })
        );
      }
      setTimeout(() => {
        setAuthChecked(true);
      }, 2000);
    }
  }, [dispath]);

  return authChecked;
};

export default useAuthChecked;
