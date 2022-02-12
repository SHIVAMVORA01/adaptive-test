import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminProtectUrl from "./Admin/AdminProtectUrl";
import ProtectUrl from "./TestScreeen/ProtectUrl";
import { isExpired, decodeToken } from "react-jwt";

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token");
  const isMyTokenExpired = isExpired(token);
  const userType = localStorage.getItem("admin");
  if (userType === "admin" && !isMyTokenExpired) {
    if (AdminProtectUrl.protect() === "") {
      return <Outlet />;
    } else {
      return <Navigate to={`${AdminProtectUrl.protect()}`} />;
    }
  } else if (userType === "user" && !isMyTokenExpired) {
    // if (ProtectUrl.protect() === "") {
    //   return <Outlet />;
    // } else {
    //   return <Navigate to={`${AdminProtectUrl.protect()}`} />;
    // }
    return <Navigate to={-1} />;
  } else {
    return <Navigate to="/logout" />;
  }
};
export default PrivateRoute;
