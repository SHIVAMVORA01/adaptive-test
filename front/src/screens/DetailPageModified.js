import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
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
    .then(res=>{
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
            <Row>
              <Col md={3} style={{ padding: "0", margin: "0", height: "100%" }}>
                <div
                  className="rectangleInstuc"
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
              <Col md={9} style={{ padding: "0", margin: "0" }}>
                <div
                  className="rectangleInstuc"
                  style={{
                    minHeight: "100%",
                    padding: "5px 35px 20px 35px",
                    margin: "0 30px",
                  }}
                >
                  <Row style={{ textAlign: "center", margin: "30px 0" }}>
                    <Col>
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "19px",
                          color: "#293e6f",
                          fontWeight: "bold",
                        }}
                      >
                        Instructions
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Row
                        style={{
                          marginRight: "30px",
                          marginLeft: "30px",
                          fontSize: "15px",
                          lineHeight: "2",
                        }}
                      >
                        <ol>
                          <li>
                            It is mandatory for you to attempt the exam in one
                            sitting.
                          </li>
                          <li>
                            You are only allowed to attempt the exam unless
                            access has been granted by the admin.{" "}
                          </li>
                          <li>
                            Exam will be in auto proctored mode. Therefore,
                            don’t use any unfair means during exam.The Test will
                            be conducted in full screen mode.
                          </li>
                          <li>
                            The exam contains six modules. You must attempt
                            every module. In case you miss any module, it will
                            not be considered as completed and will not be
                            evaluated for final result.
                          </li>
                          <li>
                            Make sure you have an uninterrupted Internet
                            Connection while giving the exam (1 MBPS preferred)
                          </li>
                          <li>
                            If the screen refreshes by accident, the progress is
                            not lost, the progress and the timer will be
                            restored to where it was before.
                          </li>
                          <li>
                            Do not switch tabs, desktops, or browsers during the
                            test, a warning will appear twice, indicating that
                            the screen has been changed. The test will be
                            auto-submitted after three warning.
                          </li>
                          <li>
                            Taking more than one test at the same time is not
                            allowed. Multiple instances of the tests are not
                            allowed.
                          </li>
                          <li>
                            During the test, the candidate should not switch and
                            move out of the test window. The test will get
                            autosubmitted.
                          </li>
                          <li>
                            {" "}
                            If you face any issue while giving the test you need
                            to contact on the given helpline number and your
                            query will be resolved immediately{" "}
                          </li>
                        </ol>
                      </Row>
                      <Row>
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
                            I have read all the <b>instructions </b>and hereby
                            accept to adhere them.
                          </label>
                        </Col>
                      </Row>
                      <Row>
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
                      </Row>
                    </Col>
                  </Row>
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
