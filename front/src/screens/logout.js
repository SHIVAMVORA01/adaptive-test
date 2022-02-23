import React, { useEffect } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MobileWidth from "../components/MobileWidth";

export default function Logout() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.post("logout/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("test");
    localStorage.removeItem("result");
    localStorage.removeItem("timetaken");
    localStorage.removeItem("test2");
    localStorage.removeItem("test2");
    localStorage.clear();
    axiosInstance.defaults.headers["Authorization"] = null;
    navigate("/login");
  });
  return <div>{isDesktopOrLaptop?"Logout":<MobileWidth/>}</div>;
}