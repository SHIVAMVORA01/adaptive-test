import React, { useState, useEffect } from "react";
import { Col, Row, ListGroup, Card, Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "../../css/AdminHomeScreen.css";
import Coding from "../../img/carbon_code.svg";
import Setting from "../../img/Brain.svg";
import Brain from "../../img/Computer.svg";
import Personality from "../../img/Domain.svg";
import AnalyticalWr from "../../img/Personality.svg";
import CompFund from "../../img/CompFund.svg";
import { useNavigate } from "react-router";
import Shivam from "../../img/Shivam.jpeg";
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { BsFillCalendar2DateFill } from 'react-icons/bs';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import { BsFillFileTextFill } from 'react-icons/bs';
import { SiOpslevel } from 'react-icons/si';
import { SiBookstack } from 'react-icons/si';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

function AdminHome() {
  useEffect(() => {
    if (localStorage.getItem("isNewTestReload") !== undefined) {
      localStorage.removeItem("isNewTestReload");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="AdminHomeScreen">
      <Navbar style={{
        backgroundColor: "#FFF",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        color: "black",
        paddingTop: "0px",
        paddingBottom: "0px",
        height: "80px",
        width: "1519.2px",
      }} expand="lg">
        <Nav>
          <div>
            <ListGroup horizontal defaultActiveKey="#link1">
              <ListGroup.Item
                action onClick={(e) => { navigate("/admin/newTest", { state: { sid: 0 } }); }}
                style={{ width: "115px", height: "80px", padding: "25px 0px", display: "block", textAlign: "center", color: "#666666", backgroundColor: "#ffffff", fontSize: "0.85em", borderRight: "2px solid rgba(0,0,0,0.07)", marginLeft: "300px", marginRight: "20px", textDecoration: "none", borderTop: "none", borderBottom: "none", borderLeft: "none" }}>
                <BsFillCalendarPlusFill style={{ width: "20px", height: "35px", marginLeft: "-31px", marginTop: "-30px", color:"#293e6f" }} />
                <p style={{ marginTop: "-2px", marginLeft: "15px", fontSize: "11.9px" }}>New Test</p>
              </ListGroup.Item>
              <ListGroup.Item
                action href="/admin/scheduledTest"
                style={{ width: "125px", height: "80px", padding: "25px 0px", display: "block", textAlign: "center", color: "#666666", backgroundColor: "#ffffff", fontSize: "0.85em", borderRight: "2px solid rgba(0,0,0,0.07)", marginLeft: "0px", marginRight: "20px", textDecoration: "none", borderTop: "none", borderBottom: "none", borderLeft: "none" }}>
                <BsFillCalendar2DateFill style={{ width: "20px", height: "35px", marginLeft: "-31px", marginTop: "-30px", color:"#293e6f" }} />
                <p style={{ marginTop: "-2px", marginLeft: "5px", fontSize: "11.9px" }}>Scheduled Test</p>
              </ListGroup.Item>
              <ListGroup.Item
                action href="/Permissions"
                style={{ width: "125px", height: "80px", padding: "25px 0px", display: "block", textAlign: "center", color: "#666666", backgroundColor: "#ffffff", fontSize: "0.85em", borderRight: "2px solid rgba(0,0,0,0.07)", marginLeft: "0px", marginRight: "20px", textDecoration: "none", borderTop: "none", borderBottom: "none", borderLeft: "none" }}>
                <BsFillCheckCircleFill style={{ width: "20px", height: "35px", marginLeft: "-31px", marginTop: "-30px", color:"#293e6f" }} />
                <p style={{ marginTop: "-2px", marginLeft: "5px", fontSize: "11.9px" }}>Accept Students</p>
              </ListGroup.Item>
              <ListGroup.Item
                action href="/admin/Feedback"
                style={{ width: "125px", height: "80px", padding: "25px 0px", display: "block", textAlign: "center", color: "#666666", backgroundColor: "#ffffff", fontSize: "0.85em", borderRight: "2px solid rgba(0,0,0,0.07)", marginLeft: "0px", marginRight: "20px", textDecoration: "none", borderTop: "none", borderBottom: "none", borderLeft: "none" }}>
                <BsFillFileTextFill style={{ width: "20px", height: "35px", marginLeft: "-21px", marginTop: "-30px", color:"#293e6f" }} />
                <p style={{ marginTop: "-2px", marginLeft: "5px", fontSize: "11.9px" }}>Accept Feedback</p>
              </ListGroup.Item>
              <label
                onClick={() => navigate("/Home")}
                style={{
                  cursor: "pointer",
                  fontFamily: "Poppins",
                  color: "#293e6f",
                  fontWeight: "500",
                  marginLeft: "45px",
                  marginTop: "30px",
                  fontSize: "13.6px",
                }}
              >
                Home
              </label>
              <label
                onClick={() => navigate("/logout")}
                style={{
                  cursor: "pointer",
                  fontFamily: "Poppins",
                  color: "red",
                  fontWeight: "500",
                  marginLeft: "45px",
                  marginTop: "30px",
                  fontSize: "13.6px",
                }}
              >
                Logout
              </label>
              <NavDropdown style={{
                width: "115px",
                height: "80px",
                padding: "25px 40px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "13.6px",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                marginLeft: "0px",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
                marginTop: "-3px",
              }}
                title="Shivam Vora" id="basic-nav-dropdown">
                <NavDropdown.Item style={{ fontSize: "13.6px" }} href="/admin/Profile">Profile</NavDropdown.Item>
                <NavDropdown.Item style={{ fontSize: "13.6px" }} href="/admin/RegisterAdmin">Register admin</NavDropdown.Item>
                <NavDropdown.Item style={{ fontSize: "13.6px" }} href="#action/3.1">Delete Profile</NavDropdown.Item>
              </NavDropdown>
            </ListGroup>
          </div>
        </Nav >
      </Navbar >
      <Row style={{ width: window.screen.width, overflow: "hidden" }}>
        <Col>
          <p className="AdWel" style={{
            fontFamily: "Poppins",
            color: "#293e6f",
            fontWeight: "400",
            marginTop: "50px",
            fontSize: "28px",
            textAlign: "center",
          }}> Welcome,<b> Shivam Vora</b></p>
          <p className="AdWell" style={{
            fontFamily: "Poppins",
            color: "#999999",
            fontWeight: "100",
            marginTop: "30px",
            fontSize: "15.4px",
            marginLeft: "100px",
            marginRight: "100px",
          }}> This portal helps the faculty placement coordinators identify and assess students' key skills and expertise, as well as their readiness for placements. Different modules in this portal cover all relevant aspects such as cognitive, domain, personality, and others that will aid them in their preparation for placements</p>
        </Col>
        <p className="AdWell" style={{
          fontFamily: "Poppins",
          color: "#293e6f",
          fontWeight: "bold",
          marginTop: "30px",
          fontSize: "18px",
          textAlign: "center",
          marginBottom: "30px",
        }}>Our Test Modules</p>
        <Row>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px" }}>
              <img src={Brain} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Aptitude</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px" }}>
              <img src={CompFund} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Fundamentals</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px" }}>
              <img src={Setting} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Domain</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px", marginTop: "40px" }}>
              <img src={Personality} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Personality</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px", marginTop: "40px" }}>
              <img src={Coding} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Coding</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "66px", width: "310px", marginLeft: "100px", marginTop: "40px" }}>
              <img src={AnalyticalWr} style={{ width: "30px", height: "30px", marginLeft: "70px", marginTop: "15px" }}></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Reasoning</p>
            </Card>
          </Col>
        </Row>
        <p className="AdWell" style={{
          fontFamily: "Poppins",
          color: "#293e6f",
          fontWeight: "bold",
          marginTop: "50px",
          fontSize: "18px",
          textAlign: "center",
          marginBottom: "30px",
        }}>Our Test Features</p>
        <Row>
          <Col md={4}>
            <Card style={{ height: "230px", width: "320px", marginLeft: "100px", marginBottom: "100px" }}>
              <SiOpslevel style={{ height: "50px", width: "50px", marginLeft: "125px", marginTop: "25px", color: "#293e6f", }} />
              <p style={{ marginLeft: "55px", marginTop: "20px", fontWeight:"bold"}}>Set difficulty level of test</p>
              <p style={{ marginLeft: "13px", marginRight: "13px", marginTop: "10px", fontSize: "13.8px", color: "#999999" }}> Choose easy, medium or hard questions from our skill libraries to assess candidates of different experience levels.</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "230px", width: "320px", marginLeft: "100px", marginBottom: "100px" }}>
              <SiBookstack style={{ height: "50px", width: "50px", marginLeft: "125px", marginTop: "25px", color: "#293e6f", }} />
              <p style={{ marginLeft: "-2px", marginTop: "20px", textAlign:"center", fontWeight:"bold"}}>Combine multiple skills into one test</p>
              <p style={{ marginLeft: "13px", marginRight: "13px", marginTop: "10px", fontSize: "13.8px", color: "#999999" }}> Add multiple skills in a single test to create an effective assessment. Assess multiple skills together.</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card style={{ height: "230px", width: "320px", marginLeft: "100px", marginBottom: "100px" }}>
              <BsFillQuestionCircleFill style={{ height: "50px", width: "50px", marginLeft: "125px", marginTop: "25px", color: "#293e6f", }} />
              <p style={{ marginLeft: "55px", marginTop: "20px", fontWeight:"bold" }}>Add your own questions</p>
              <p style={{ marginLeft: "13px", marginRight: "13px", marginTop: "10px", fontSize: "13.8px", color: "#999999" }}> Add, edit or bulk upload your own coding questions, MCQ and more.</p>
            </Card>
          </Col>
        </Row>
      </Row>
    </div>

  );
}

export default AdminHome;
