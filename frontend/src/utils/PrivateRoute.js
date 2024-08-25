import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return token !== null;
  };

  return <>{isAuthenticated() ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
