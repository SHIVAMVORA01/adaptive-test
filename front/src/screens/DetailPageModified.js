import React, { useState, useEffect } from "react";
import { Col, Row, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import Loader from "../components/Loader";
import MobileWidth from "../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import { TiTick } from "react-icons/ti";
import { CgDanger } from "react-icons/cg";
import ScreenSizeDetector from "screen-size-detector";
import { addListener, removeListener, launch, stop } from "devtools-detector";
import "../css/LoginScreen.css";
import axiosInstance from "../axios";

function DetailPageModified() {
  const imageAddr =
    "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200714180638/CIP_Launch-banner.png";
  const downloadSize = 81200; //bytes
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const { detect } = require("detect-browser");
  const browser = detect();
  const screen = new ScreenSizeDetector();
  const [screen_height, set_screen_height] = useState();
  const [screen_width, set_screen_width] = useState();
  screen.setMainCallback("widthchange", () => set_screen_width(screen.width));
  screen.setMainCallback("heightchange", () =>
    set_screen_height(screen.height)
  );

  const [agree, setAgree] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [checkSpeed, setCheckSpeed] = useState();
  const [isDevToolsOpen, setIsDevToolsOpen] = useState();
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState();
  const navigate = useNavigate();
  const isOpen = (isDevOpen) =>
    isDevOpen ? setIsDevToolsOpen(true) : setIsDevToolsOpen(false);

  useEffect(() => {
    addListener(isOpen);
    launch();
    set_screen_height(screen.height);
    set_screen_width(screen.width);
    setIsFullScreenEnabled(document.fullscreenEnabled);
    let userType = sessionStorage.getItem("admin");
    let path = ProtectUrl.protect();
    const token = sessionStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);
    if (!isMyTokenExpired) {
      if (sessionStorage.getItem("result")) {
        navigate("/result");
      } else {
        if (userType === "user" && path !== "") {
          navigate(ProtectUrl.protect());
        } else if (userType === "admin") {
          navigate(-1);
        }
      }
    } else if (isMyTokenExpired) {
      navigate("/logout");
    }
    let time_start, end_time;
    let downloadImgSrc = new Image();
    downloadImgSrc.onload = function () {
      end_time = new Date().getTime();
      displaySpeed();
    };
    time_start = new Date().getTime();
    downloadImgSrc.src = imageAddr;
    function displaySpeed() {
      let duration = (end_time - time_start) / 1000;
      let bitsLoaded = downloadSize * 8;
      let speedBps = (bitsLoaded / duration).toFixed(2);
      let speedKbps = (speedBps / 1024).toFixed(2);
      let speedMbps = (speedKbps / 1024).toFixed(2);
      setCheckSpeed(speedMbps);
    }
    setIsloading(false);
    return () => {
      stop();
      removeListener(isOpen);
      set_screen_width();
      set_screen_height();
    };
  }, []);

  const handleSubmit = (e) => {
    setIsloading(true);
    e.preventDefault();
    let ob = new Date();
    let h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
    let m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
    let s = (ob.getMinutes() < 10 ? "0" : "") + ob.getSeconds();
    sessionStorage.setItem("screenchange", 0);
    let username = sessionStorage.getItem('username')
    let acc_token = "JWT " + sessionStorage.getItem("access_token");
    axiosInstance.defaults.headers["Authorization"] = acc_token;
    axiosInstance
      .post(`api/setresult/${username}`, {
        data: { testId: sessionStorage.getItem("testId") },
      })
      .then(res => {
        sessionStorage.setItem(
          "test",
          JSON.stringify({
            username: sessionStorage.getItem("username"),
            STime: Date(),
            strtTime: +h + ":" + m + ":" + s,
            FSTimer: "10",
            question: [],
            marks: [],
            currentQsNo: 1,
          })
        );
        setIsloading(false);
        navigate("/aptitude");
      })
  };

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  return (
    <>
      {isDesktopOrLaptop ? (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <Row style={{ height: "100%", margin: "0px" }}>
              <Col md={5} >
              <div
                  style={{
                    padding: "15px 35px 30px 35px",
                    margin: "0 10px",
                  }}
                >
                  <Row>
                    <Row style={{ textAlign: "center", margin: "20px 0px" }}>
                      <Col>
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: "18px",
                            color: "#293e6f",
                            fontWeight: "bold",
                          }}
                        >
                          System Check
                        </div>
                      </Col>
                    </Row>
                    <Row style={{ fontSize: "14px" }}>
                      <p>
                        <b style={{ color: "#293e6f" }}> Browser: </b>
                        {browser.name} V{browser.version}
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}> Speed:</b>{" "}
                        {checkSpeed !== undefined && checkSpeed} mbps
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}>Operating Sytem: </b>
                        {browser.os}
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}>Screen Size: </b>
                        {screen_width !== undefined && screen_width}px by{" "}
                        {screen_height !== undefined && screen_height}px{" "}
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}>Full Screen Mode: </b>
                        {isFullScreenEnabled ? "Enabled" : "Disabled"}
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        {isFullScreenEnabled ? (
                          <>
                            <TiTick style={{ color: "#10B65C" }} />
                            Requirement satisfied
                          </>
                        ) : (
                          <>
                            <CgDanger
                              style={{ color: "#842029", marginRight: "2px" }}
                            ></CgDanger>
                            Requirement not satisfied
                          </>
                        )}
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}>Devtools: </b>
                        {isDevToolsOpen ? "Opened" : "Closed"}
                      </p>
                      <p
                        style={{
                          color: isDevToolsOpen ? "#842029" : "#10B65C",
                          textAlign: "center",
                          marginBottom: "20px",
                        }}
                      >
                        {isDevToolsOpen ? (
                          <>
                            <CgDanger
                              style={{ color: "#842029", marginRight: "2px" }}
                            ></CgDanger>
                            Requirement not satisfied
                          </>
                        ) : (
                          <>
                            <TiTick style={{ color: "#10B65C" }}></TiTick>
                            Requirement satisfied
                          </>
                        )}
                      </p>
                    </Row>
                    <div
                      style={{
                        backgroundColor: !(!isDevToolsOpen && isFullScreenEnabled)
                            ? "#f8d7da"
                            : "#D1E7DD",
                        width: "95%",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          color: !(!isDevToolsOpen && isFullScreenEnabled)
                            ? "#842029"
                            : "#10B65C",
                          textAlign: "center",
                          fontSize: "14px",
                          paddingTop: "15px",
                        }}
                      >
                        {" "}
                        {!(!isDevToolsOpen && isFullScreenEnabled)
                          ? "Please satisfy the given requirements"
                          : "You are all set to give the assessment."}
                      </p>
                    </div>
                  </Row>
                </div>
              </Col>
              <Col md={7} style={{ backgroundColor: "white", borderLeft: "3px solid #F1F1F1", height: "1000px" }}>
                <div>
                  <div style={{ borderLeft: "3px solid #293E6F", height: "50px", marginTop: "20px", marginLeft: "10px" }}>
                    <h2 style={{ fontSize: "18px", color: "#293E6F", fontFamily: "sans-serif", fontWeight: "medium", padding: "0 0 6px", marginTop: "20px", marginLeft: "10px" }}>Assessment Guidelines</h2>
                    <p style={{ fontSize: "14px", fontFamily: "sans-serif", fontWeight: "400", padding: "0 0 6px", marginTop: "-10px", marginLeft: "10px" }}>Kindly read through the following key instructions and important guidelines for this assessment:</p>
                  </div>
                  <div style={{ borderLeft: "2px solid #293E6F", height: "20px", marginTop: "30px", marginLeft: "10px" }}>
                    <h2 style={{ fontSize: "16px", color: "#293E6F", fontFamily: "sans-serif", fontWeight: "500", padding: "0 0 6px", marginTop: "20px", marginLeft: "10px" }}>Timelines & Questions:</h2>
                    <ul>
                      <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "medium", lineHeight: "22px", marginBottom: "6px" }}>
                        <b style={{ fontFamily: "sans-serif", color:"#293E6F" }}>Assessment Window:</b>  05 Mar 22, 12:00 PM IST to 05 Mar 22, 08:00 PM IST
                      </li>
                      <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                        <b style={{ fontFamily: "sans-serif" , color:"#293E6F"}}>Assessment Duration:</b> 00:30:00 (hh:mm:ss)
                      </li>
                      <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                        You can attempt the assessment anytime between the provided assessment window.
                      </li>
                      <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                        Please ensure that you attempt the assessment in one sitting as once you start the assessment, the timer won’t stop.
                      </li>
                      <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                        You will have to finish the assessment before 05 Mar 22, 08:00 PM IST. To get the complete assessment duration, you need to start the assessment latest by 05 Mar 22, 07:30 PM IST. Otherwise, you’ll get less time to complete the assessment.
                      </li>
                    </ul>
                    <div className="proct">
                      <h2 style={{ fontSize: "16px", color: "#293E6F", fontFamily: "sans-serif", fontWeight: "500", padding: "0 0 6px", marginTop: "10px", marginLeft: "10px" }}>Proctoring Related:</h2>
                      <ul>
                        <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                          You can take the assessment only on a desktop/laptop and in full-screen mode. </li>

                        <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                          You must not refresh the screen. However, if the screen refreshes by accident, the progress will not be lost, the progress and the timer will be restored to where it was before.
                        </li>
                        <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                          You should not switch tabs, desktops, or browsers during the test, a warning will appear twice, indicating that the screen has been changed. The test will be auto-submitted after two warnings.
                        </li>
                      </ul>
                      <div className="proct1">
                        <h2 style={{ fontSize: "16px", color: "#293E6F", fontFamily: "sans-serif", fontWeight: "500", padding: "0 0 6px", marginTop: "10px", marginLeft: "10px" }}>Key Instructions:</h2>
                        <ul>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You can access the assessment once you have registered and have been accepted by the admin.</li>

                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You won’t be able to browse through the questions. If you either skip your question or submit your answer, it is marked and stored, and cannot be altered.
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You must attempt every module. This exam contains six modules. In case you miss any module, it will not be considered as completed and will not be evaluated for the final result.                      </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You must have an uninterrupted Internet Connection while giving the exam (1 MBPS preferred).
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You will be allowed to give the test once and in a single sitting.
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            Once the time is over for a section, you'll be taken to the next section automatically.
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            You'll have to submit answers/code/solutions to all the questions individually.
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            Any participant resorting to unfair practices will be directly disqualified from the challenge.
                          </li>
                          <li style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", lineHeight: "22px", marginBottom: "6px" }}>
                            All decisions in the matter of eligibility, authenticity & final judgment will be with the admin.</li>
                        </ul>
                        <div>
                          <Accordion flush>
                            <Accordion.Item>
                              <Accordion.Header style={{border:"none", outline:"none"}}>Please confirm the following statements</Accordion.Header>
                              <Accordion.Body className="acc" style={{fontFamily:"sans-serif", fontSize:"14px"}}>
                                <Col>
                                 <p>I understand that,</p>
                                  <input
                                    style={{ marginLeft: "30px" }}
                                    type="checkbox"
                                    id="agree"
                                    onChange={checkboxHandler}
                                  />
                                  <label
                                   className="check"
                                    style={{
                                      marginLeft: "15px",
                                      marginBottom: "15px",
                                      fontSize: "14px",
                                    }}
                                    htmlFor="agree"
                                  >
                                    {" "}
                                    This assessment will work only in full-screen mode.
                                  </label>
                                </Col>
                                <Col>
                                  <input
                                    style={{ marginLeft: "30px" }}
                                    type="checkbox"
                                    id="agree"
                                    onChange={checkboxHandler}
                                  />
                                  <label

                                    style={{
                                      marginLeft: "15px",
                                      marginBottom: "15px",
                                      fontSize: "14px",
                                    }}
                                    htmlFor="agree"
                                  >
                                    {" "}
                                    Switching tabs will result in full screen violation.
                                  </label>
                                </Col>
                                <Col>
                                  <input
                                    style={{ marginLeft: "30px" }}
                                    type="checkbox"
                                    id="agree"
                                    onChange={checkboxHandler}
                                  />
                                  <label
                                    style={{
                                      marginLeft: "15px",
                                      marginBottom: "15px",
                                      fontSize: "14px",
                                    }}
                                    htmlFor="agree"
                                  >
                                    {" "}
                                    Escape button press or click will result in full screen violation.
                                  </label>
                                </Col>
                                <Col>
                                  <input
                                    style={{ marginLeft: "30px" }}
                                    type="checkbox"
                                    id="agree"
                                    onChange={checkboxHandler}
                                  />
                                  <label
                                    style={{
                                      marginLeft: "15px",
                                      marginBottom: "15px",
                                      fontSize: "14px",
                                    }}
                                    htmlFor="agree"
                                  >
                                    {" "}
                                    Any other activity that disturbs the full screen mode may result in termination of the assessment
                                  </label>
                                </Col>
                                <Col>
                                  <input
                                    style={{ marginLeft: "30px" }}
                                    type="checkbox"
                                    id="agree"
                                    onChange={checkboxHandler}
                                  />
                                  <label
                                    style={{
                                      marginLeft: "15px",
                                      marginBottom: "15px",
                                      fontSize: "14px",
                                    }}
                                    htmlFor="agree"
                                  >
                                    {" "}
                                    I have read all the above statements and thereby will adhere them.
                                  </label>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                        <button
                          disabled={
                            !(agree && !isDevToolsOpen && isFullScreenEnabled)
                          }
                          onClick={(e) => {
                            handleSubmit(e);
                          }}
                          style={{
                            backgroundColor: "#10B65C",
                            width: "120px",
                            border: "none",
                            marginTop: "20px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            fontSize: "14px",
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

          )}
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}

export default DetailPageModified;
