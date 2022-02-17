import React, { useState, useEffect } from "react";
import { Col, Row, ListGroup, Card } from "react-bootstrap";
import "../../css/AdminHomeScreen.css";
import Coding from "../../img/carbon_code.svg";
import Setting from "../../img/Brain.svg";
import Brain from "../../img/Computer.svg";
import Personality from "../../img/Domain.svg";
import AnalyticalWr from "../../img/Personality.svg";
import CompFund from "../../img/CompFund.svg";
import { useNavigate } from "react-router";
import Shivam from "../../img/Shivam.jpeg";

function AdminHome() {
  useEffect(() => {
    if (localStorage.getItem("isNewTestReload") !== undefined) {
      localStorage.removeItem("isNewTestReload");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <Row>
        <Col md="4">
          <div className="rectngle">
            <img
              height="50px"
              width="50px"
              style={{
                borderRadius: "50%",
                marginLeft: "20px",
                marginTop: "20px",
                textAlign: "center",
              }}
              src={Shivam}
              alt="profilePic"
            />
            <p
              style={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "600",
                fontSize: "18px",
                color: "#293E6F",
                textAlign: "left",
                marginLeft: "90px",
                marginTop: "-50px",
              }}
            >
              Shivam Vora
            </p>
            <p
              style={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "16px",
                color: "#293E6F",
                textAlign: "left",
                marginLeft: "90px",
                marginTop: "-8px",
              }}
            >
              Admin
            </p>
          </div>
          <div className="rectngle1">
            <ListGroup defaultActiveKey="#link1">
              <ListGroup.Item
                action
                onClick={(e) => {
                  navigate("/admin/newTest", { state: { sid: 0 } });
                }}
                style={{
                  padding: "23px",
                  borderRadius: "0px",
                  border: "2px solid #e0e0e0",
                  borderTop: "2px",
                  borderBottom: "2px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                New test
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="/admin/scheduledTest"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Scheduled Test
              </ListGroup.Item>

              <ListGroup.Item
                action
                href="#link3"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                View profile
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#link4"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Delete profile
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#link5"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Edit profile
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#link6"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Accept students
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#link7"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Feedback
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="/logout"
                style={{
                  padding: "23px",
                  border: "2px solid #e0e0e0",
                  borderTop: "0px",
                  color: "#293E6F",
                  fontSize: "15px",
                }}
              >
                Logout
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
        <Col md="8" style={{ marginTop: "20px" }}>
          <p
            style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "25px",
              lineHeight: "52px",
              color: "#293E6F",
              textAlign: "center",
            }}
          >
            Our Test Modules
          </p>
          <Row>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={Brain}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Aptitude
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={CompFund}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Fundamentals
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={Coding}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Coding
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={Setting}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Domain
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={Personality}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Personality
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6" md="6" lg="4">
              <Card
                style={{
                  marginLeft: "50px",
                  marginTop: "40px",
                  width: "200px",
                }}
              >
                <Card.Img
                  variant="top"
                  src={AnalyticalWr}
                  style={{
                    width: "70px",
                    marginLeft: "60px",
                    marginTop: "20px",
                  }}
                />
                <Card.Body>
                  <Card.Title style={{ textAlign: "center", fontSize: "18px" }}>
                    Analytical Writing
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default AdminHome;
