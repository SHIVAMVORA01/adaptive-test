import React from "react";
import { Container, Row, Col, Button, Footer, Modal } from "react-bootstrap";
import "../css/Home.css";
import { useNavigate } from "react-router";
import illustration1 from "../img/illustration1.svg";
import illustration2 from "../img/illustration2.svg";
import illustration3 from "../img/illustration3.svg";
import Chaitanya from "../img/Chaitanya.jpeg";
import alan from "../img/alan.jpg";
import Shivam from "../img/Shivam.jpeg";
import {useState} from 'react'
import '../../node_modules/react-modal-video/scss/modal-video.scss'
import ReactPlayer from 'react-player/lazy'

function Home() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
         <Modal
            id="result_page"
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-custom-modal-styling-title"
            
            
          >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{padding: "0", margin:"0"}}>
            <ReactPlayer height='532px' width='100%' controls={false} pip={true} muted={false} playbackRate= {2} loop={true}  url='https://youtu.be/OgtDzJHB5Po' />
            </Modal.Body>
          </Modal>
      <div className="welcomeDiv">
        <div>
          <div className="titleDiv" style={{ height: "400px" }}>
            <label className="mainheading">
              Welcome to the
              <br />
              Placement Test Portal
            </label>
            <label className="subHeadingsProfile">
              One Step towards a successful career
            </label>
            <div>
              <Button
                className="buttonDiv"
                style={{
                  background: "#10B65C",
                  color: "#FFF",
                  width: "200px",
                  fontSize: "20px",
                  marginTop: "2%",
                  border: "none",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
              <Button
                className="buttonDiv"
                onClick={()=> setShow(true)}
                style={{
                  background: "#10B65C",
                  color: "#FFF",
                  width: "200px",
                  fontSize: "20px",
                  marginTop: "2%",
                  border: "none",
                }}
              >
                Preview
              </Button>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ textAlign: "center", marginTop: "1%" }} id="initiative">
          <br />
          <label className="divHeadings">About this portal</label>
        </div>
        <br />
        <Container>
          <Row>
            <Col md={7} lg={8}>
              <div className="landingPara">
                <label className="subHeadingsProfile1">
                  What does this portal do?
                </label>
                <label className="introPara">
                  This portal is a proctored employability assessment for third
                  and fourth-year engineering students. It gives information on
                  a candidate's performance and areas for improvement across
                  modules that are important for a successful career.
                </label>
              </div>
            </Col>
            <Col md={5} lg={4}>
              <img
                alt="illustration1"
                src={illustration1}
                className="welcomeImage2"
              ></img>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col md={5} lg={4}>
              <img
                alt="logo"
                src={illustration2}
                className="welcomeImage3"
              ></img>
            </Col>
            <Col md={7} lg={8}>
              <div className="landingPara1">
                <label className="subHeadingsProfile1">
                  Why should I attempt these tests?
                </label>
                <label className="introPara">
                  Students can gain knowledge and experience of the skill needs
                  of organizations as well as the benchmarks they use for
                  entry-level and lateral recruitment across all major
                  industries by attempting such tests. These insights can be
                  used to improve skills and take a step forward in a long-term
                  career.
                </label>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col md={7} lg={8}>
              <div className="landingPara">
                <label className="subHeadingsProfile1">
                  How will this portal benefit the undergraduate?
                </label>
                <label className="introPara">
                  This portal helps the faculty placement coordinators identify
                  and assess students' key skills and expertise, as well as
                  their readiness for placements. Different modules in this
                  portal cover all relevant aspects such as cognitive, domain,
                  personality, and others that will aid them in their
                  preparation for placements.{" "}
                </label>
                <br />
              </div>
            </Col>
            <Col md={5} lg={4} className="colImageDiv">
              <img
                alt="illustration2"
                src={illustration3}
                className="welcomeImage"
              ></img>
            </Col>
          </Row>
          <Container id="team" className="mb-5 ourteam pt-5">
            <div>
              <h3
                style={{
                  fontSize: "25px",
                  lineHeight: "25px",
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  color: "#293E6F",
                  textAlign: "center",
                }}
              >
                Our Team
              </h3>
            </div>
            <Row>
              <Col style={{ textAlign: "center", marginTop: "35px" }} md={4}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <img className="user" alt="logo" src={alan}></img>
                    <div className="username">Alankrit Arya</div>
                    <div className="role">Developer</div>
                  </div>
                </div>
              </Col>
              <Col style={{ textAlign: "center", marginTop: "35px" }} md={4}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <img className="user" alt="logo" src={Chaitanya}></img>
                    <div className="username">Chaitanya Kumbhar</div>
                    <div className="role">Developer</div>
                  </div>
                </div>
              </Col>
              <Col style={{ textAlign: "center", marginTop: "35px" }} md={4}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <img className="user" alt="logo" src={Shivam}></img>
                    <div className="username">Shivam Vora</div>
                    <div className="role">Developer</div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    </div>
  );
}

export default Home;
