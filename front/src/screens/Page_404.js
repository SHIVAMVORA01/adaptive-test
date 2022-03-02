import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import Page_404_svg from "../img/Page_404.svg";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import { isExpired, decodeToken } from "react-jwt";
import "../css/Page_404.css";
import AdminProtectUrl from "../components/Admin/AdminProtectUrl";
function Page_404() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);
    if (!isMyTokenExpired) {
      let xx = ProtectUrl.protect();
      let yy = AdminProtectUrl.protect();
      let typeUser = sessionStorage.getItem("username");
      if (xx !== "" || yy !== "") {
        if (typeUser === "admin") {
          navigate(yy);
        } else {
          navigate(xx);
        }
      }
    }
  }, []);
  return (
    <div>
      <Row>
        <Col>
          <img className="EPsvg" alt="logo" src={Page_404_svg}></img>
        </Col>
      </Row>

      <Row className="EPheader">
        <Col>
          {" "}
          <h3 style={{ textAlign: "center" }}>Oops I'm Feeling Lost</h3>
        </Col>
      </Row>
      <Row className="EPcontent" style={{ margin: "10px 0px" }}>
        <Col>
          <h6 style={{ textAlign: "center" }}>
            Why don't you try one of this page instead?
          </h6>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <button className="btn EPbut" onClick={() => navigate("/")}>
            Home
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default Page_404;
