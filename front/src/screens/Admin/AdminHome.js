import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  ListGroup,
  Card,
  Navbar,
  Nav,
} from "react-bootstrap";
import "../../css/AdminHomeScreen.css";
import Coding from "../../img/carbon_code.svg";
import Setting from "../../img/Brain.svg";
import Brain from "../../img/Computer.svg";
import Personality from "../../img/Domain.svg";
import AnalyticalWr from "../../img/Personality.svg";
import CompFund from "../../img/CompFund.svg";
import { useNavigate } from "react-router";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { BsFillFileTextFill } from "react-icons/bs";
import { SiBookstack } from "react-icons/si";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { RiLogoutCircleFill } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";
import { AiFillControl } from "react-icons/ai";

function AdminHome() {
  useEffect(() => {
    if (localStorage.getItem("isNewTestReload") !== undefined) {
      localStorage.removeItem("isNewTestReload");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="AdminHomeScreen">
      <Navbar
        style={{
          backgroundColor: "#FFF",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          color: "black",
          height: "75px",
          padding: "0 10%",
          display: "block",
        }}
      >
        <Nav style={{ display: "block" }}>
          <ListGroup horizontal defaultActiveKey="#link1">
            <ListGroup.Item
              action
              href="/"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <AiFillHome
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Home
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={(e) => {
                navigate("/admin/newTest", { state: { sid: 0 } });
              }}
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <BsFillCalendarPlusFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                New Test
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/admin/scheduledTest"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <BsFillCalendar2DateFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Scheduled Test
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/admin/RegisterAdmin"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <RiAdminFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Register Admin
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/Permissions"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <BsFillCheckCircleFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Accept Students
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/admin/Feedback"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <BsFillFileTextFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Feedback
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/admin/Profile"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
              }}
            >
              <BsFillFileEarmarkPersonFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Profile
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              action
              href="/logout"
              style={{
                width: "50%",
                height: "75px",
                padding: "25px 0px",
                display: "block",
                textAlign: "center",
                color: "#666666",
                backgroundColor: "#ffffff",
                fontSize: "0.85em",
                borderRight: "2px solid rgba(0,0,0,0.07)",
                textDecoration: "none",
                borderTop: "none",
                borderBottom: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
            >
              <RiLogoutCircleFill
                style={{
                  width: "20px",
                  height: "35px",
                  marginTop: "-30px",
                  color: "#293e6f",
                }}
              />
              <p
                style={{
                  marginTop: "-2px",
                  textAlign: "center",
                  fontSize: "11.9px",
                }}
              >
                Logout
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Nav>
      </Navbar>
      <Row style={{ padding: 0, margin: 0 }}>
        <Col style={{ padding: 0 }}>
          <p
            className="AdWel"
            style={{
              fontFamily: "Poppins",
              color: "#293e6f",
              fontWeight: "400",
              marginTop: "50px",
              fontSize: "28px",
              textAlign: "center",
            }}
          >
            {" "}
            Welcome,<b> Shivam Vora</b>
          </p>
          <p
            className="AdWell"
            style={{
              fontFamily: "Poppins",
              color: "#999999",
              fontWeight: "100",
              marginTop: "30px",
              fontSize: "15.4px",
              marginLeft: "100px",
              marginRight: "100px",
            }}
          >
            {" "}
            This portal helps the faculty placement coordinators identify and
            assess students' key skills and expertise, as well as their
            readiness for placements. Different modules in this portal cover all
            relevant aspects such as cognitive, domain, personality, and others
            that will aid them in their preparation for placements
          </p>
        </Col>
        <p
          className="AdWell"
          style={{
            fontFamily: "Poppins",
            color: "#293e6f",
            fontWeight: "bold",
            marginTop: "30px",
            fontSize: "18px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Our Test Modules
        </p>
        <Row style={{ margin: "0 auto", textAlign: "center" }}>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{ height: "66px", textAlign: "center", margin: "0 17%" }}
            >
              <img
                src={Brain}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "25%",
                  marginTop: "15px",
                }}
              ></img>
              <p style={{ marginLeft: "45%", marginTop: "-25px" }}>Aptitude</p>
            </Card>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{
                height: "66px",
                textAlign: "center",
                margin: "0 17%",
                paddingTop: "15px",
                paddingRight: "5%",
                paddingLeft: "15%",
              }}
            >
              <img
                src={CompFund}
                style={{
                  width: "30px",
                  height: "30px",
                }}
              ></img>
              <p style={{ marginLeft: "30%", marginTop: "-25px" }}>
                Fundamentals
              </p>
            </Card>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{ height: "66px", textAlign: "center", margin: "0 17%" }}
            >
              <img
                src={Setting}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "70px",
                  marginTop: "15px",
                }}
              ></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Domain</p>
            </Card>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{ height: "66px", textAlign: "center", margin: "0 17%" }}
            >
              <img
                src={Personality}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "70px",
                  marginTop: "15px",
                }}
              ></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>
                Personality
              </p>
            </Card>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{ height: "66px", textAlign: "center", margin: "0 17%" }}
            >
              <img
                src={Coding}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "70px",
                  marginTop: "15px",
                }}
              ></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>Coding</p>
            </Card>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={4}
            style={{
              padding: "0 auto",
              margin: "5px 0 15px 0",
              display: "inline-block",
            }}
          >
            <Card
              style={{ height: "66px", textAlign: "center", margin: "0 17%" }}
            >
              <img
                src={AnalyticalWr}
                style={{
                  width: "30px",
                  height: "30px",
                  marginLeft: "70px",
                  marginTop: "15px",
                }}
              ></img>
              <p style={{ marginLeft: "130px", marginTop: "-25px" }}>
                Reasoning
              </p>
            </Card>
          </Col>
        </Row>
        <p
          className="AdWell"
          style={{
            fontFamily: "Poppins",
            color: "#293e6f",
            fontWeight: "bold",
            marginTop: "50px",
            fontSize: "18px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Our Test Features
        </p>
        <Row style={{ margin: "0 auto 40px auto", textAlign: "center" }}>
          <Col sm={12} md={6} lg={4}>
            <Card
              style={{
                height: "230px",
                textAlign: "center",
                margin: "0 17%",
                padding: "0 10px",
              }}
            >
              <img
                src={Setting}
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "15px 41% 0px auto",
                }}
              ></img>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                Set difficulty level of test
              </p>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "13.8px",
                  color: "#999999",
                }}
              >
                {" "}
                Choose easy, medium or hard questions from our skill libraries
                to assess candidates of different experience levels.
              </p>
            </Card>
          </Col>
          <Col sm={12} md={6} lg={4}>
            <Card
              style={{
                height: "230px",
                textAlign: "center",
                margin: "0 17%",
                padding: "0 10px",
              }}
            >
              <img
                src={Setting}
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "15px 41% 0px auto",
                }}
              ></img>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                Combine multiple skills into one test
              </p>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "13.8px",
                  color: "#999999",
                }}
              >
                {" "}
                Add multiple skills in a single test to create an effective
                assessment. Assess multiple skills together.
              </p>
            </Card>
          </Col>
          <Col sm={12} md={6} lg={4}>
            <Card
              style={{
                height: "230px",
                textAlign: "center",
                margin: "0 17%",
                padding: "0 10px",
              }}
            >
              <img
                src={Setting}
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "15px 41% 0px auto",
                }}
              ></img>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                Add your own questions
              </p>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "13.8px",
                  color: "#999999",
                }}
              >
                {" "}
                Add, edit or bulk upload your own coding questions, MCQ and
                more.
              </p>
            </Card>
          </Col>
        </Row>
      </Row>
    </div>
  );
}

export default AdminHome;
