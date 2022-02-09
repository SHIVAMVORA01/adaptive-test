import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../css/Home.css";
import { useNavigate } from "react-router";
function Home() {
  const navigate = useNavigate();
  return (
    <div>
         <div className="welcomeDiv" >
                <div>
                    <div className="titleDiv">
                        <label className="mainHeading">Welcome to the<br/>Placement Profile Portal</label>
                        <label className="subHeadingsProfile">Attempt the tests now</label>
                        <Button style={{ background: "#10B65C", color: "#FFF", width: "200px", fontSize: "20px", marginTop: "2%", border: "none" }} onClick={() => { navigate("/logout") }}>Login</Button>
                        <br/>
                    </div>
                </div>
            </div>
            <div>
                <div style={{ textAlign: "center", marginTop: "1%" }} id="initiative">
                    <br />
                    <label className="divHeadings">About this portal</label>
                </div>
                <br />
                <Container >
                    <Row>
                        <Col md={7} lg={8}>
                            <div className="landingPara">
                                <label className="subHeadingsProfile1">What does this portal do?</label>
                                <label className="introPara">This portal is a proctored employability assessment for third and fourth-year engineering students. It gives information on a candidate's performance and areas for improvement across modules that are important for a successful career.</label>
                            </div>
                        </Col>
                        <Col md={5} lg={4}>
                            <img alt="illustration1" src="front\src\img\illustration1.svg" className="welcomeImage"></img>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col md={5} lg={4}>
                            <img alt="logo" src="front\src\img\illustration1.svg" className="welcomeImage"></img>
                        </Col>
                        <Col md={7} lg={8}>
                            <div className="landingPara1">
                                <label className="subHeadingsProfile1">Why should I attempt these tests?</label>
                                <label className="introPara">Students can gain knowledge and experience of the skill needs of organizations as well as the benchmarks they use for entry-level and lateral recruitment across all major industries by attempting such tests. These insights can be used to improve skills and take a step forward in a long-term career.</label>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col md={7} lg={8}>
                            <div className="landingPara" >
                                <label className="subHeadingsProfile1">How will this portal benefit the undergraduate?</label>
                                <label className="introPara">This portal helps the faculty placement coordinators identify and assess students' key skills and expertise, as well as their readiness for placements. Different modules in this portal cover all relevant aspects such as cognitive, domain, personality, and others that will aid them in their preparation for placements. </label>
                                <br/>
                            </div>
                        </Col>
                        <Col md={5} lg={4} className="colImageDiv">
                            <img alt="illustration2" src="front\src\img\illustration1.svg" className="welcomeImage"></img>
                        </Col>
                    </Row>
                </Container>
            </div>
    </div>
   
  );
}

export default Home;