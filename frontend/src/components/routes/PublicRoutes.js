import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PublicRoutes = ({children}) => {
  const auth = useAuth()

  return !auth ? children : <Navigate to={"/inbox"} />;
};

export default PublicRoutes;
