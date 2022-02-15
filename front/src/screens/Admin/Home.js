import React, { useState, useEffect } from "react";
import { Col, Row, ListGroup, Card, Button } from "react-bootstrap";
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
  const [key, setKey] = useState('home')
  useEffect(() => {
    if (localStorage.getItem("isNewTestReload") !== undefined) {
      localStorage.removeItem("isNewTestReload");
    }
  }, []);

  const navigate = useNavigate();
  function navigateTo(e, sectionName, sid) { }
  return (
    <div>
      <Row>
        <Col md="4">
          <div className="displayCard"
          style={{
            display: 'flex',
            justifyContent: 'flex-Start',
          }}
          >
            <div>
              <img height="100px" width="100px" style={{ borderRadius: "50%"}} src={Shivam} alt="profilePic" />
            </div>
            <div className="displayCardColumn"
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <p style={{
                 fontFamily: "Poppins",
                 fontStyle: "normal",
                 fontWeight: "600",
                 fontSize: "20px",
                 lineHeight:" 18px",
                 color: "#293E6F",
                 marginLeft: "30px",
                 marginTop: "20px",

              }} >Shivam Vora</p>
              <p style={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "18px",
                lineHeight:" 14px",
                color: "#293E6F",
                marginLeft: "30px",
                marginTop: "10px",
              }}>Admin</p>
            </div>
          </div>
          <p style={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontSize: "20px",
            lineHeight: "30px",
            color: "#293E6F",
            marginTop: "40px"
          }}>
            <b>Admin Panel</b>
          </p>
          <ListGroup defaultActiveKey="#link1">
            <ListGroup.Item action href="/admin/scheduledTest" style={{ padding: "25px", color: "#293E6F" }}>
              Scheduled Test
            </ListGroup.Item>
            <ListGroup.Item action onClick={(e)=> {navigate("/admin/newTest", { state: { sid: 0 } })}} style={{ padding: "25px", color: "#293E6F" }}>
              New test
            </ListGroup.Item>
            <ListGroup.Item action href="#link3" style={{ padding: "25px", color: "#293E6F" }}>
              View profile
            </ListGroup.Item>
            <ListGroup.Item action href="/logout" style={{ padding: "25px", color: "#293E6F" }}>
              Logout
            </ListGroup.Item>
            <ListGroup.Item action href="#link4" style={{ padding: "25px", color: "#293E6F" }}>
              Feedback
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md="8" style={{ marginTop: '20px' }}>
          <Row>
            <p style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "25px",
              lineHeight: "52px",
              color: "#293E6F",
              textAlign: "center"

            }}
            >Our Test Modules</p>
            <Col md="4" >
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}  >
                <Card.Img variant="top" src={Brain} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Aptitude</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}  >
                <Card.Img variant="top" src={CompFund} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Fundamentals</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}  >
                <Card.Img variant="top" src={Coding} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Coding</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}  >
                <Card.Img variant="top" src={Setting} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Domain</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}>
                <Card.Img variant="top" src={Personality} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Personality</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card style={{ marginLeft: "50px", marginTop: "40px", width: "200px" }}>
                <Card.Img variant="top" src={AnalyticalWr} style={{ width: "70px", marginLeft: "60px", marginTop: "20px" }} />
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center', fontSize: '18px' }} >Analytical Writing</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row >
    </div >
  );
}

export default AdminHome;
