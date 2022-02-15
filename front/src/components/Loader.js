import React from "react";
import { WifiLoader } from "react-awesome-loaders";

function Loader() {
  return (
    <div
      className="loader"
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "190px",
      }}
    >
      <WifiLoader
        background={"transparent"}
        desktopSize={"60px"}
        mobileSize={"60px"}
        text={"Loading"}
        backColor="#E8F2FC"
        frontColor="#293E6F"
      />
    </div>
  );
}

export default Loader;
