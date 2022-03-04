import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TestHeaderComp from "../../components/TestScreeen/TestHeaderComp";
import QuestionComp from "../../components/TestScreeen/QuestionComp";
import { Col, Modal, Button, Row } from "react-bootstrap";
import QuestionNavigatorComp from "../../components/TestScreeen/QuestionNavigatorComp";
import "../../css/TestScreen.css";
import { useNavigate } from "react-router";
import { isExpired, decodeToken } from "react-jwt";
import CustomTimer from "../Admin/CustomTimer";
import getCurrentTime from "../../components/TestScreeen/dateCalc";
import axiosInstance from "../../axios";
import ProtectUrl from "../../components/TestScreeen/ProtectUrl";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import { AiFillWarning } from "react-icons/ai";
import createActivityDetector from "activity-detector";

function PTestScreen() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const [hard, setHard] = useState([]);
  const [medium, setMedium] = useState([]);
  const [easy, setEasy] = useState([]);
  const [current, setCurrent] = useState(2);
  const [qs, setQs] = useState([]);
  const [total, setTotal] = useState(0);
  const [ans, setAns] = useState([]);
  const [qsno, setQsno] = useState(0);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [reload, isReload] = useState(false);
  const handleClose = () => {
    setShow(false);
    setMd(true);
  };
  const [countWindowAway, setCountWindowAway] = useState(0);
  const [countWindowAwayModal, setCountWindowAwayModal] = useState(false);
  const [testFinshBool, setTestFinishBool] = useState(false);
  const [time, setTime] = useState();
  const [md, setMd] = useState(false);
  const [newScreen, setNewScreen] = useState(false);
  const [timeFF, setTimeFF] = useState();
  const activityDetector = createActivityDetector({
    timeToIdle: 6000000000000000_0000,
    autoInit: false,
  });
  activityDetector.on("idle", () => {
    windowAway();
  });

  useEffect(() => {
    window.onkeydown = function(e) {
      if(e.keyCode == 123) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
         return false;
      }
    }
    activityDetector.init();
    function fullscreenc() {
      var full_screen_element = document.fullscreenElement;

      if (full_screen_element === null) {
        setShow(true);
        setMd(false);
        isReload(true);
      }
    }
    function contextm(event) {
      event.preventDefault();
    }
    window.addEventListener("contextmenu", contextm);
    window.addEventListener("fullscreenchange", fullscreenc);
    let flag = true;
    if (
      !(sessionStorage.getItem("test5") && !sessionStorage.getItem("test6"))
    ) {
      if (!sessionStorage.getItem("test6")) {
        let az = ProtectUrl.protect();
        if (az !== "") navigate(az);
        navigate(-1);
        flag = false;
      }
    }
    if (flag) {
      var full_screen_element = document.fullscreenElement;

      if (full_screen_element === null) {
        setShow(true);
        setMd(false);
        isReload(true);
      }
      if (!sessionStorage.getItem("test6")) {
        let ax = JSON.parse(sessionStorage.getItem("test5"));
        let user = sessionStorage.getItem("username");
        if (ax) {
          let ar = ax["marks"];
          let maxMarks = ax["maxMarks"];
          let gotMarks = ax["marks"];
          let total = 0;
          for (let i = 0; i < ar.length; i++) {
            if (ar[i] !== -1) total = total + ar[i];
          }
          axiosInstance
            .post("api/marks/4", {
              data: {
                username: user,
                marks: total,
                maxMarks: maxMarks,
                testId: sessionStorage.getItem("testId"),
                gotMarks: gotMarks,
                check_result: 0,
              },
            })
            .then((res) => {
              sessionStorage.removeItem("test5");
            })
            .catch((e) => console.log(e));
        }
        let txx = getCurrentTime();
        let hh = txx.hh;
        let mm = txx.mm;
        let ss = txx.ss;
        sessionStorage.setItem(
          "test6",
          JSON.stringify({
            username: user,
            STime: Date(),
            FSTimer: "10",
            question: [],
            marks: [],
            strtTime: +hh + ":" + mm + ":" + ss,
            currentQsNo: 1,
          })
        );
      }
      var test = JSON.parse(sessionStorage.getItem("test6"));
      const token = sessionStorage.getItem("access_token");
      const isMyTokenExpired = isExpired(token);
      if (test) {
        if (test["question"].length !== 0) {
          isReload(true);
          setShow(true);
        }
      }
      if (isMyTokenExpired) {
        navigate("/login");
        return;
      } else {
        if (sessionStorage.getItem("result")) {
          navigate("/result");
        } else {
          let xx = sessionStorage.getItem("testId");
          const getData = async () =>
            await axiosInstance
              .get(`api/subs/4/${xx}`)
              .then((res) => {
                let a = converttime(res.data.time);
                var tf = a;
                var totalQs = res.data.qs;
                if (totalQs > 0) {
                  if (test["question"].length === 0) {
                    setTimeFF(tf);
                    var mediumArrRes = res.data.allQs;
                    var index = getRandomInt(0, res.data.allQs.length);
                    setQs([...qs, mediumArrRes[index]]);
                    test["question"].push(mediumArrRes[index]);
                    mediumArrRes.splice(index, 1);
                    setMedium(mediumArrRes);
                    let ar = new Array(res.data.qs).fill(-1);
                    setAns(ar);
                    test["marks"] = ar;
                    sessionStorage.setItem("test6", JSON.stringify(test));
                  } else {
                    var qss = test["question"];
                    var y = res.data.allQs;

                    for (let i = 0; i < qss.length; i++) {
                      if (
                        y
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques) !== -1
                      ) {
                        let b = y
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques);
                        y.splice(b, 1);
                      }
                    }
                    setMedium(y);
                    var ar = test["marks"];
                    setAns(ar);
                    setQsno(test["currentQsNo"] - 1);
                    setQs(test["question"]);

                    var ob = new Date();
                    var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
                    var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
                    var s = (ob.getSeconds() < 10 ? "0" : "") + ob.getSeconds();

                    var timeStart = new Date(
                      new Date().toLocaleDateString() + " " + test["strtTime"]
                    );
                    var timeEnd = new Date(
                      new Date().toLocaleDateString() +
                        " " +
                        h +
                        ":" +
                        m +
                        ":" +
                        s
                    );
                    var hourDiff = (timeEnd - timeStart) / 1000;
                    setTimeFF(tf - hourDiff);
                  }
                } else {
                  navigate("/analytical");
                }
              })
              .catch((e) => {
                console.log(e);
              });
          getData();
        }
      }
    }
    return () => {
      window.removeEventListener("contextmenu", contextm);
      window.removeEventListener("fullscreenchange", fullscreenc);
      activityDetector.stop();
      window.onkeydown = null
    };
  }, []);
  function GoInFullscreen(element) {
    if (document.fullscreenElement === null) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      element.style.overflowY = `auto`;
      element.classList.add(`style-4`);
    }
  }

  function windowAway() {
    var ccount = parseInt(sessionStorage.getItem("screenchange"));
    setCountWindowAway(ccount + 1);
    if (ccount + 1 < 3) {
      sessionStorage.setItem("screenchange", ccount + 1);
      setCountWindowAwayModal(true);
    } else {
      navigate("/result");
    }
  }

  function converttime(timex) {
    let secs = 0;
    let x = timex.split(":");
    secs = secs + parseInt(x[0]) * 3600 + parseInt(x[1]) * 60 + parseInt(x[2]);
    return secs;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function click(e) {
    e.preventDefault();

    var myans = -1;
    const formData = new FormData(e.target);
    for (var pair of formData.entries()) {
      myans = pair[1];
    }
    setTotal(total + parseInt(myans));
    var x;
    ans[qsno] = parseInt(myans);
    setAns(ans);
    var test = JSON.parse(sessionStorage.getItem("test6"));

    var index = 0;
    switch (2) {
      case 1:
        break;
      case 2:
        index = getRandomInt(0, medium.length);
        setQs([...qs, medium[index]]);
        test["question"].push(medium[index]);
        medium.splice(index, 1);
        break;
      case 3:
        break;
    }
    test["marks"] = ans;
    if (ans.length - 1 === qsno) {
      navigate("/analytical");
      sessionStorage.setItem("test6", JSON.stringify(test));
    } else {
      setQsno(qsno + 1);
      test["currentQsNo"] = test["currentQsNo"] + 1;
      sessionStorage.setItem("test6", JSON.stringify(test));
      e.target.reset();
    }
  }
  function handleCloseSChange(e) {
    setCountWindowAwayModal(false);
    GoInFullscreen(document.querySelector("#element"));
  }

  return (
    <div>
      {isDesktopOrLaptop ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Enter FullScreeen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {reload ? (
                <CustomTimer
                  msg={`Please Enter Full Screen or Test will get auto submitted in`}
                  onlyS={true}
                  reset={md}
                  time={10}
                  start={show}
                  setMd={setMd}
                  nextpage={"result"}
                ></CustomTimer>
              ) : (
                "Please enter Full Screen mode"
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={(e) => {
                  handleClose(e);
                  GoInFullscreen(document.querySelector("#element"));
                }}
              >
                Enter Full Screeen
              </Button>
            </Modal.Footer>
          </Modal>
          {
            <div>
              <div>
                <Row>
                  <Col md="9">
                    <div className="TestHeaderComp">
                      {timeFF !== undefined && (
                        <TestHeaderComp
                          timer={timeFF}
                          start={!testFinshBool}
                          reset={testFinshBool}
                          timeKey="Time"
                          totalKey="Total"
                          totalValue={ans.length}
                          header="Personality"
                          nextpage={"analytical"}
                          setMd={setMd}
                        ></TestHeaderComp>
                      )}
                    </div>
                  </Col>
                  <Col md="3">
                    <button
                      onClick={(e) => {
                        setTestFinishBool(true);
                        setShow(false);
                        setMd(true);
                        navigate("/result");
                        if (document.exitFullscreen) {
                          document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) {
                          document.webkitExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                          document.mozCancelFullScreen();
                        } else if (document.msExitFullscreen) {
                          document.msExitFullscreen();
                        }
                      }}
                      style={{
                        backgroundColor: "#081466",
                        fontWeight: "500",
                        textAlign: "center",
                        width: "100%",
                        height: "60px",
                        borderRadius: "14px",
                        color: "white",
                        boxShadow:
                          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      }}
                    >
                      Finish Test
                    </button>
                  </Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col md="9">
                    <div
                      className="QuestionComp"
                      style={{ minHeight: "50px", backgroundColor: "black" }}
                    >
                      <form onSubmit={click}>
                        {qs !== undefined &&
                          qsno !== undefined &&
                          qs[qsno] !== undefined &&
                          !countWindowAwayModal && (
                            <QuestionComp
                              isPersonality={true}
                              ans={ans}
                              qsno={qsno}
                              level={current}
                              question={qs[qsno].ques}
                              options={[]}
                              qsimg={null}
                            ></QuestionComp>
                          )}
                        {countWindowAwayModal && (
                          <>
                            <div
                              style={{
                                backgroundColor: "#F8D7DA",
                                height: "fit-content",
                                width: "95%",
                                border: "1px #8A3C5B",
                                borderRadius: "8px",
                                textAlign: "center",
                                margin: "10px 10px 10px 25px",
                              }}
                            >
                              <AiFillWarning
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  textAlign: "center",
                                  margin: "20px 0",
                                  color: "#842029",
                                }}
                              />
                              <p
                                style={{
                                  color: "#842029",
                                  textAlign: "center",
                                }}
                              >
                                <b>
                                  {countWindowAway === 1 ? "1st" : "Last"}{" "}
                                  Warning
                                </b>
                              </p>
                              <p
                                style={{
                                  color: "#842029",
                                  fontWeight: "normal",
                                  fontSize: "14px",
                                  margin: "0 10px 10px 10px",
                                  textAlign: "center",
                                }}
                              >
                                The screen has been changed.Test will get auto
                                submitted if you try to change screen again{" "}
                              </p>
                              <Button
                                onClick={(e) => handleCloseSChange(e)}
                                style={{
                                  backgroundColor: "#842029",
                                  margin: "10px 0",
                                  color: "white",
                                  outline: "none",
                                  border: "none",
                                }}
                              >
                                Continue
                              </Button>
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  </Col>
                  <Col md="3">
                    <div
                      className="QuestionNavigatorComp"
                      style={{ minHeight: "550px", backgroundColor: "black" }}
                    >
                      <QuestionNavigatorComp
                        attempted={ans}
                      ></QuestionNavigatorComp>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          }
        </>
      ) : (
        <MobileWidth />
      )}
    </div>
  );
}

export default PTestScreen;
