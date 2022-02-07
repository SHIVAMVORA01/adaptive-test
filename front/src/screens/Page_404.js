import React,{useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import Page_404_svg from "../img/Page_404.svg";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import "../css/Page_404.css";
function Page_404() {
  const navigate = useNavigate();
  useEffect(()=>{
    let xx = ProtectUrl.protect()
    if(!(xx === "/result")){
      navigate(xx)
    }
  },[])
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
          <button className="btn EPbut" onClick={() => navigate("/logout")}>
            Log In
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default Page_404;
