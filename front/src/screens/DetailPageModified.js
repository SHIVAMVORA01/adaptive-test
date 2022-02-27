import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import "../css/LoginScreen.css";
import Loader from "../components/Loader";
import MobileWidth from "../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import { TiTick } from "react-icons/ti";

function DetailPageModified() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  var isNode = require("detect-node");
  const { detect } = require("detect-browser");
  const browser = detect();
  const ScreenSizeDetector = require("screen-size-detector");
  const screen = new ScreenSizeDetector();
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [checkSpeed, setCheckSpeed] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    let userType = localStorage.getItem("admin");
    let path = ProtectUrl.protect();
    const token = localStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);
    if (!isMyTokenExpired) {
      if (localStorage.getItem("result")) {
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
    var userImageLink =
      "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200714180638/CIP_Launch-banner.png";
    var time_start, end_time;
    var result;
    var downloadSize = 5616998;
    var downloadImgSrc = new Image();
    downloadImgSrc.onload = function () {
      end_time = new Date().getTime();
      displaySpeed();
    };
    time_start = new Date().getTime();
    downloadImgSrc.src = userImageLink;
    function displaySpeed() {
      var timeDuration = (end_time - time_start) / 1000;
      var loadedBits = downloadSize * 0.008;
      var bps = (loadedBits / timeDuration).toFixed(2);
      var speedInKbps = (bps / 1024).toFixed(2);
      var speedInMbps = (speedInKbps / 1024).toFixed(2);
      setCheckSpeed(speedInMbps);
    }
    setIsloading(false);
  }, []);

  const handleSubmit = (e) => {
    setIsloading(true);
    e.preventDefault();
    var ob = new Date();
    var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
    var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
    var s = (ob.getMinutes() < 10 ? "0" : "") + ob.getSeconds();
    localStorage.setItem("screenchange", 0);
    localStorage.setItem(
      "test",
      JSON.stringify({
        username: localStorage.getItem("username"),
        STime: Date(),
        strtTime: +h + ":" + m + ":" + s,
        FSTimer: "10",
        question: [],
        marks: [],
        currentQsNo: 1,
      })
    );
    setIsloading(false);
    navigate("/testScreen");
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
              <Col md={4} style={{ padding: "0", margin: "0" }}>
                <div
                  className="rectangleInstuc"
                  style={{
                    height: "630px",
                    padding: "15px 35px 30px 35px",
                    margin: "0 40px",
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
                        <b style={{ color: "#293e6f" }}>Screensize: </b>
                        {screen.width}px by {screen.height}px{" "}
                      </p>
                      <p style={{ color: "#10B65C", textAlign: "center" }}>
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                      <p style={{ paddingTop: "10px" }}>
                        <b style={{ color: "#293e6f" }}>Javascript: </b>
                        {isNode ? "Node.js" : "Enabled"}
                        {!isNode ? "" : "Disabled"}
                      </p>
                      <p
                        style={{
                          color: "#10B65C",
                          textAlign: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <TiTick style={{ color: "#10B65C" }}></TiTick>
                        Requirement satisfied
                      </p>
                    </Row>
                    <div
                      style={{
                        backgroundColor: "#D1E7DD",
                        height: "90px",
                        width: "95%",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          color: "#10B65C",
                          textAlign: "justified",
                          fontSize: "12px",
                          marginTop: "16px",
                        }}
                      >
                        {" "}
                        You are all set to give the assessment. Read and Agree
                        to the instruction given to begin the assessment.{" "}
                      </p>
                    </div>
                  </Row>
                </div>
              </Col>
              <Col md={8} style={{ padding: "0", margin: "0" }}>
                <div
                  className="rectangleInstuc"
                  style={{
                    minHeight: "550px",
                    padding: "5px 35px 30px 35px",
                    margin: "0 40px",
                  }}
                >
                  <Row style={{ textAlign: "center", margin: "30px 0px" }}>
                    <Col>
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "18px",
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
                          fontSize: "14px",
                          lineHeight: "1.5",
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
                      <Row style={{ marginTop: "25px" }}>
                        <Col>
                          <input
                            style={{ marginLeft: "30px" }}
                            type="checkbox"
                            id="agree"
                            onChange={checkboxHandler}
                          />
                          <label
                            style={{
                              marginLeft: "25px",
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
                      <button
                        disabled={!agree}
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                        style={{
                          backgroundColor: "#10B65C",
                          width: "120px",
                          border: "none",
                          marginTop: "20px",
                          marginLeft: "310px",
                          fontSize: "14px",
                        }}
                        type="button"
                        className="btn btn-primary"
                      >
                        Start Test
                      </button>
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
