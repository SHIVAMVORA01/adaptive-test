import React from "react";
import { useNavigate } from "react-router";
import MobileWidth from "../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function Error() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const navigate = useNavigate();
  return (
    <div>
      {isDesktopOrLaptop?<>
        <h3> Error cannot open multiple instances</h3>
      <h5>Test is open on another tab</h5>
      <button onClick={() => navigate("/logout")}>Log In Again</button>
      </>:<MobileWidth/>}
    </div>
  );
}

export default Error;
