import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminProtectUrl from "./Admin/AdminProtectUrl";
import { isExpired, decodeToken } from "react-jwt";
import axiosInstance from "../axios";

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token");
  const isMyTokenExpired = isExpired(token);
  const userType = localStorage.getItem("admin");
  const refreshToken = localStorage.getItem("refresh_token");
  const isRefreshExpired = isExpired(refreshToken);
  if (userType === "admin" && !isMyTokenExpired && !isRefreshExpired) {
    if (AdminProtectUrl.protect() === "") {
      return <Outlet />;
    } else {
      return <Navigate to={`${AdminProtectUrl.protect()}`} />;
    }
  } else if (userType === "user" && !isMyTokenExpired && !isRefreshExpired) {
    return <Navigate to={-1} />;
  } else if (userType === "admin" && isMyTokenExpired && !isRefreshExpired) {
    if (refreshToken) {
      const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
      // exp date in token is expressed in seconds, while now() returns milliseconds:
      const now = Math.ceil(Date.now() / 1000);
      if (tokenParts.exp > now) {
        axiosInstance
          .post("/token/refresh/", { refresh: refreshToken })
          .then((response) => {
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            axiosInstance.defaults.headers["Authorization"] =
              "JWT " + response.data.access;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Refresh token is expired", tokenParts.exp, now);
        return <Navigate to="/logout" />;
      }
    } else {
      console.log("Refresh token not available.");
      return <Navigate to="/logout" />;
    }
    return <Outlet />;
  } else {
    return <Navigate to="/logout" />;
  }
};
export default PrivateRoute;
