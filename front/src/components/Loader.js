import React from "react";
import { WifiLoader } from "react-awesome-loaders";

function Loader() {
  return (

    <div className="loader"
    style={{
      textAlign: "center",
      display: 'flex',  
      justifyContent:'center', 
      alignItems:'center',
      marginTop: '190px',
    }}
    >
    <WifiLoader
      background={"transparent"}
      desktopSize={"100px"}
      mobileSize={"100px"}
      text={"Loading"}
      backColor="#E8F2FC"
      frontColor="#4645F6"
    />
    </div>
  );
}

export default Loader;
