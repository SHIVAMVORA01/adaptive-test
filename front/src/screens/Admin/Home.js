import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import "../../css/AdminHomeScreen.css";
import Coding from "../../img/carbon_code.svg";
import Setting from "../../img/Brain.svg";
import Brain from "../../img/Computer.svg";
import Personality from "../../img/Domain.svg";
import AnalyticalWr from "../../img/Personality.svg";
import CompFund from "../../img/CompFund.svg";
import { useNavigate } from "react-router";

function AdminHome() {
  useEffect(() => {
    if (localStorage.getItem("isNewTestReload") !== undefined) {
      localStorage.removeItem("isNewTestReload");
    }
  }, []);
  const navigate = useNavigate();
  function navigateTo(e, sectionName, sid) {}
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="mainHeading">Our Test Modules</div>
        <div>
          <button
            style={{ color: "white" }}
            className="btn scTest"
            onClick={(e) => navigate("/admin/newTest", { state: { sid: 0 } })}
          >
            New Tests
          </button>
          <button
            style={{ color: "white" }}
            className="btn scTest"
            onClick={(e) => navigate("/admin/scheduledTest")}
          >
            Scheduled Test
          </button>
        </div>
      </div>
      <Row>
        <Col>
          <div
            className="rectangle"
            onClick={(e) => navigateTo(e, "Aptitude", 1)}
          >
            <img className="carbonImage" alt="logo" src={Brain}></img>
          </div>
          <h5 className="secName">Aptitude</h5>
        </Col>
        <Col>
          <div
            className="rectangle"
            onClick={(e) => navigateTo(e, "Computer Fundamentals", 2)}
          >
            <img className="carbonImage" alt="logo" src={CompFund}></img>
          </div>
          <h5 className="secNameBig">Computer Fundamentals</h5>
        </Col>
        <Col>
          <div
            className="rectangle"
            onClick={(e) => navigateTo(e, "Coding", 6)}
          >
            <img className="carbonImage" alt="logo" src={Coding}></img>
          </div>
          <h5 className="secName">Coding</h5>
        </Col>
      </Row>

      <Row style={{ marginTop: "10px" }}>
        <Col>
          <div
            className="rectangle"
            onClick={(e) => navigateTo(e, "Domain", 3)}
          >
            <img className="carbonImage" alt="logo" src={Setting}></img>
          </div>
          <h5 className="secName">Domain</h5>
        </Col>
        <Col>
          <div
            className="rectangle"
            onClick={(e) => navigateTo(e, "Personality", 4)}
          >
            <img className="carbonImage" alt="logo" src={Personality}></img>
          </div>
          <h5 className="secName">Personality</h5>
        </Col>
        <Col>
          <div className="rectangle">
            <img className="carbonImage" alt="logo" src={AnalyticalWr}></img>
          </div>
          <h5 className="secName1">Analytical Writing</h5>
        </Col>
      </Row>
    </div>
  );
}

export default AdminHome;
