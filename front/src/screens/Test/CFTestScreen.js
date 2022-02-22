import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TestHeaderComp from "../../components/TestScreeen/TestHeaderComp";
import QuestionComp from "../../components/TestScreeen/QuestionComp";
import { Col, Modal, Button, Row } from "react-bootstrap";
import QuestionNavigatorComp from "../../components/TestScreeen/QuestionNavigatorComp";
import "../../css/TestScreen.css";
import { useNavigate } from "react-router";
import { isExpired, decodeToken } from "react-jwt";
import $ from "jquery";
import CustomTimer from "../Admin/CustomTimer";
import getCurrentTime from "../../components/TestScreeen/dateCalc";
import axiosInstance from "../../axios";
import crypt from "../../components/TestScreeen/crypt";
import ProtectUrl from "../../components/TestScreeen/ProtectUrl";

function CFTestScreen() {
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
    if (!(localStorage.getItem("test") && !localStorage.getItem("test2"))) {
      if (!localStorage.getItem("test2")) {
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
      if (!localStorage.getItem("test2")) {
        let user = localStorage.getItem("username");
        if (localStorage.getItem("test")) {
          let ax = JSON.parse(localStorage.getItem("test"));
          let ar = ax["marks"];
          let maxMarks = ax["maxMarks"];
          let gotMarks = ax["marks"];
          let total = 0;
          for (let i = 0; i < ar.length; i++) {
            if (ar[i] !== -1) total = total + ar[i];
          }
          axiosInstance
            .post("api/marks/1", {
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
              localStorage.removeItem("test");
            })
            .catch((e) => console.log(e));
        }
        let txx = getCurrentTime();
        let hh = txx.hh;
        let mm = txx.mm;
        let ss = txx.ss;
        localStorage.setItem(
          "test2",
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
      var test = JSON.parse(localStorage.getItem("test2"));
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
              .get(`api/subs/2/${xx}`)
              .then((res) => {
                let a = converttime(res.data.time);
                var tf = a;
                var totalQs = res.data.qs;
                if (totalQs > 0) {
                  if (test["question"].length === 0) {
                    setTimeFF(tf);
                    setEasy(res.data.easy);
                    setHard(res.data.hard);
                    var mediumArrRes = res.data.medium;
                    var index = getRandomInt(0, res.data.medium.length);
                    setQs([...qs, mediumArrRes[index]]);
                    test["question"].push(mediumArrRes[index]);
                    test["currentLevel"] = 2;
                    mediumArrRes.splice(index, 1);
                    setMedium(mediumArrRes);
                    let ar = new Array(res.data.qs).fill(-1);
                    setAns(ar);
                    test["marks"] = ar;
                    test["maxMarks"] = [2];
                    localStorage.setItem("test2", JSON.stringify(test));
                  } else {
                    var qss = test["question"];
                    var x = res.data.easy;
                    var y = res.data.medium;
                    var z = res.data.hard;
                    for (let i = 0; i < qss.length; i++) {
                      if (
                        x
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques) !== -1
                      ) {
                        let a = x
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques);
                        x.splice(a, 1);
                      } else if (
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
                      } else if (
                        z
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques) !== -1
                      ) {
                        let c = z
                          .map(function (e) {
                            return e.ques;
                          })
                          .indexOf(qss[i].ques);
                        z.splice(c, 1);
                      }
                    }
                    setEasy(x);
                    setHard(z);
                    setMedium(y);
                    setCurrent(test["currentLevel"]);
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
                  localStorage.removeItem("test2");
                  navigate("/admin/compiler");
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
      myans = crypt.decryptVal(pair[1]);
    }
    setTotal(total + parseInt(myans));
    var x;
    ans[qsno] = parseInt(myans);
    setAns(ans);
    var test = JSON.parse(localStorage.getItem("test2"));
    if (myans > 0) {
      if (current < 3) {
        setCurrent(current + 1);
        x = current + 1;
      } else {
        x = 3;
      }
    } else {
      if (current > 1) {
        setCurrent(current - 1);
        x = current - 1;
      } else {
        x = 1;
      }
    }
    var index = 0;
    switch (x) {
      case 1:
        index = getRandomInt(0, easy.length);
        setQs([...qs, easy[index]]);
        test["question"].push(easy[index]);
        test["currentLevel"] = 1;
        if (ans.length - 1 !== qsno) test["maxMarks"].push(1);
        easy.splice(index, 1);
        break;
      case 2:
        index = getRandomInt(0, medium.length);
        setQs([...qs, medium[index]]);
        test["question"].push(medium[index]);
        test["currentLevel"] = 2;
        if (ans.length - 1 !== qsno) test["maxMarks"].push(2);
        medium.splice(index, 1);
        break;
      case 3:
        index = getRandomInt(0, hard.length);
        setQs([...qs, hard[index]]);
        test["question"].push(hard[index]);
        test["currentLevel"] = 3;
        if (ans.length - 1 !== qsno) test["maxMarks"].push(5);
        hard.splice(index, 1);
        break;
    }
    test["marks"] = ans;
    if (ans.length - 1 === qsno) {
      navigate("/admin/compiler");
      localStorage.setItem("test2", JSON.stringify(test));
    } else {
      setQsno(qsno + 1);
      test["currentQsNo"] = test["currentQsNo"] + 1;
      localStorage.setItem("test2", JSON.stringify(test));
      e.target.reset();
      checkBoxToggle(e);
    }
  }
  function handleCloseSChange(e) {
    setCountWindowAwayModal(false);
    GoInFullscreen(document.querySelector("#element"));
  }
  function checkBoxToggle(e, optId = undefined) {
    $(".form-check input.qsRadio").removeAttr("checked");
    if (optId !== undefined) {
      var input = $(`.form-check input#${optId}`);
      input.attr("checked", "checked");
    }
    e.preventDefault();
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
                      header="Computer Fundamentals"
                      nextpage={"admin/compiler"}
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
                          ans={ans}
                          qsno={qsno}
                          level={current}
                          checkBoxToggle={checkBoxToggle}
                          question={qs[qsno].ques}
                          options={qs[qsno].options}
                          qsimg={qs[qsno].img}
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

export default CFTestScreen;
