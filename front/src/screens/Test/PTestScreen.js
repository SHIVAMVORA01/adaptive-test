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

function PTestScreen() {
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

  useEffect(() => {
    let flag = true;
    if (!(localStorage.getItem("test5") && !localStorage.getItem("test6"))) {
      if (!localStorage.getItem("test6")) {
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
      if (!localStorage.getItem("test6")) {
        let ax = JSON.parse(localStorage.getItem("test5"));
        let user = localStorage.getItem("username");
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
                testId: localStorage.getItem("testId"),
                gotMarks: gotMarks,
                check_result: 0,
              },
            })
            .then((res) => {
              localStorage.removeItem("test5");
            })
            .catch((e) => console.log(e));
        }
        let txx = getCurrentTime();
        let hh = txx.hh;
        let mm = txx.mm;
        let ss = txx.ss;
        localStorage.setItem(
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
      var test = JSON.parse(localStorage.getItem("test6"));
      const token = localStorage.getItem("access_token");
      const isMyTokenExpired = isExpired(token);
      const channel = new BroadcastChannel("tab");
      const items = { ...localStorage };
      channel.postMessage("another-tab");
      // note that listener is added after posting the message

      channel.addEventListener("message", (msg) => {
        if (msg.data === "another-tab") {
          // message received from 2nd tab
          // alert('Cannot open multiple instances');
          // navigate('/error')
        }
      });

      if (test) {
        if (test["question"].length !== 0) {
          console.info("This page is reloaded");
          isReload(true);
          setShow(true);
        }
      }
      if (isMyTokenExpired) {
        navigate("/login");
        return;
      } else {
        if (localStorage.getItem("result")) {
          navigate("/result");
        } else {
          let xx = localStorage.getItem("testId");
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
                    localStorage.setItem("test6", JSON.stringify(test));
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
                  navigate("/admin/analytical");
                }
              })
              .catch((e) => {
                console.log(e);
              });
          getData();
        }
      }
    }
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
  document.addEventListener("fullscreenchange", function () {
    var full_screen_element = document.fullscreenElement;

    if (full_screen_element === null) {
      setShow(true);
      setMd(false);
      isReload(true);
    }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      windowAway();
    }
  });
  function windowAway() {
    var ccount = countWindowAway + 1;
    setCountWindowAway(countWindowAway + 1);
    if (ccount < 3) {
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
    var test = JSON.parse(localStorage.getItem("test6"));

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
      navigate("/admin/analytical");
      localStorage.setItem("test6", JSON.stringify(test));
    } else {
      setQsno(qsno + 1);
      test["currentQsNo"] = test["currentQsNo"] + 1;
      localStorage.setItem("test6", JSON.stringify(test));
      e.target.reset();
    }
  }
  function handleCloseSChange(e) {
    setCountWindowAwayModal(false);
    GoInFullscreen(document.querySelector("#element"));
  }

  return (
    <div>
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
                      nextpage={"admin/analytical"}
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
                  FINISH TEST
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
                        <h4 style={{ color: "red" }}>
                          Screen Change Detected !!{" "}
                          {countWindowAway === 1 ? "1st" : "LAST"} WARNING
                        </h4>
                        <h6>
                          Screen changed detected.Test will get auto submitted
                          if you try to change screen again !!
                        </h6>
                        <button
                          className="btn"
                          onClick={(e) => handleCloseSChange(e)}
                          style={{
                            backgroundColor: "#10B65C",
                            margin: "0px 0px 10px 3px",
                            color: "white",
                          }}
                        >
                          Okay
                        </button>
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
    </div>
  );
}

export default PTestScreen;
