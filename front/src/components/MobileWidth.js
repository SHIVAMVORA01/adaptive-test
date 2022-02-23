import React from "react";
import { Row } from "react-bootstrap";
import { GoAlert } from "react-icons/go";
function MobileWidth() {
  return (
    <Row>
      <div
        className="mobile_width_error"
        style={{
          background: "#F8D7DA",
          border: " 2px solid #F5C2C7",
          boxSizing: "border-box",
          borderRadius: "14px",
          textAlign: "center",
          width: "50%",
          height: "150px",
          padding: "3%",
          display: "inline-block",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
        }}
      >
        <GoAlert
          style={{
            height: "20px",
            width: "20px",
            color: "#842029",
            marginTop: "15px",
          }}
        />
        <p style={{ marginTop: "25px", textAlign: "center", color: "#842029" }}>
          Please increase your window size
        </p>
      </div>
    </Row>
  );
}

export default MobileWidth;
