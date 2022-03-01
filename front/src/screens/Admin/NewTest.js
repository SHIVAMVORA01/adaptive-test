import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import "../../css/AdminHomeScreen.css";
import $ from "jquery";
import sidFunc from "./sidFunc";
import DateTimePicker from "react-datetime-picker";
import axiosInstance from "../../axios";
import Loader from "../../components/Loader";
import Alert from "../../components/Admin/Alert";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function NewTest() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  //Current Sec Data
  const [easy, setEasy] = useState([]);
  const [med, setMed] = useState([]);
  const [hard, setHard] = useState([]);
  const [qs, setQs] = useState(0);
  const [axData, setAxData] = useState({});
  const [tests, setTests] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [aptDic, setAptDic] = useState({ time: "00:00:20", totalQs: 1 });
  const [CFDic, setCFDic] = useState({ time: "00:00:20", totalQs: 1 });
  const [DDic, setDDic] = useState({ time: "00:00:20", totalQs: 1 });
  const [PDic, setPDic] = useState({ time: "00:00:20", totalQs: 35 }); //$
  const [CDic, setCDic] = useState({ time: "00:00:20", totalQs: 3 });
  const [AWDic, setAWDic] = useState({ time: "00:00:20", totalQs: 3 });

  const [CurrentDic, setCurrentDic] = useState({
    time: "00:00:20",
    totalQs: 1,
  });

  const [sectionName, setSectionName] = useState([]);
  const [sDate, setSDate] = useState(new Date());
  const [eDate, setEDate] = useState(new Date());
  const [tName, setTName] = useState();
  const [sid, setSid] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    setIsloading(true);
    const data = async () =>
      await axiosInstance
        .get(`api/subs`)
        .then((res) => {
          var ssid;
          if (localStorage.getItem("isNewTestReload") !== null) {
            ssid = 0;
            setSid(ssid + 1);
          } else {
            localStorage.setItem("isNewTestReload", false);
            ssid = location.state.sid;
            setSid(ssid + 1);
          }
          var d = res.data.data;
          setAxData(d);
          //For Aptitude
          var Wssid = sidFunc(ssid);
          setSectionName(Wssid);
          setEasy(d[Wssid].easy);
          setHard(d[Wssid].hard);
          setMed(d[Wssid].medium);
          setQs(d[Wssid].qs);
          if (d[Wssid].medium.length !== 0) {
            setCurrentDic(aptDic);
          } else {
            setCurrentDic({ time: "00:00:20", totalQs: 0 });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    const getTest = async () => {
      await axiosInstance
        .get("api/admin/tests")
        .then((res) => {
          let ar = [];
          let st = res.data.stests;
          let ut = res.data.utests;
          setTests(ar.concat(st, ut));
        })
        .catch((e) => console.log(e));
    };
    getTest();
    data();
    setIsloading(false);
  }, []);

  function saveTest(e) {
    setIsloading(true);
    e.preventDefault();
    let sx = new Date(sDate);
    let ex = new Date(eDate);
    if (ex.getTime() > sx.getTime()) {
      let objClash = clash(sx.getTime(), ex.getTime());
      if (!objClash.bool) {
        let creaTest = { testName: tName, sTime: sDate, eTime: eDate };
        let a = [
          {
            sub: "Aptitude",
            time: aptDic.time,
            totalQs: aptDic.totalQs,
            maxQs: check_MaxQS_Db({
              isPersonality: false,
              easy: axData["Aptitude"].easy.length,
              medium: axData["Aptitude"].medium.length,
              hard: axData["Aptitude"].hard.length,
            }),
          },
          {
            sub: "Computer Fundamentals",
            time: CFDic.time,
            totalQs: CFDic.totalQs,
            maxQs: check_MaxQS_Db({
              isPersonality: false,
              easy: axData["Computer Fundamentals"].easy.length,
              medium: axData["Computer Fundamentals"].medium.length,
              hard: axData["Computer Fundamentals"].hard.length,
            }),
          },
          {
            sub: "Domain",
            time: DDic.time,
            totalQs: DDic.totalQs,
            maxQs: check_MaxQS_Db({
              isPersonality: false,
              easy: axData["Domain"].easy.length,
              medium: axData["Domain"].medium.length,
              hard: axData["Domain"].hard.length,
            }),
          },
          {
            sub: "Personality",
            time: PDic.time,
            totalQs: PDic.totalQs,
            maxQs: check_MaxQS_Db({
              isPersonality: true,
              easy: axData["Personality"].easy.length,
              medium: axData["Personality"].medium.length,
              hard: axData["Personality"].hard.length,
            }),
          },
          { sub: "Coding", time: CDic.time, totalQs: CDic.totalQs, maxQs: 3 },
          {
            sub: "Analytical Writing",
            time: AWDic.time,
            totalQs: AWDic.totalQs,
            maxQs: 3,
          },
        ];
        axiosInstance
          .post("api/admin/saveTest", {
            data: { saveTest: a, createTest: creaTest },
          })
          .then((res) => {
            setIsloading(false);
            navigate("/admin/home");
          });
      } else {
        setIsloading(false);
        setIsAlertDangerMsgLoaded(true);
        setDangerMsg(objClash.msg);
      }
    } else {
      setIsloading(false);
      setIsAlertDangerMsgLoaded(true);
      setDangerMsg("End time must be greater than start time");
    }
  }
  function clash(stx, etx) {
    for (let i = 0; i < tests.length; i++) {
      let ss = new Date(tests[i].test_start).getTime();
      let ee = new Date(tests[i].test_end).getTime();
      if (tests[i].test_name === tName) {
        return { bool: 1, msg: "Name cannot be same as other test" };
      }
      if ((stx >= ss && stx <= ee) || (etx >= ss && etx <= ee)) {
        return { bool: 1, msg: "This test will clash with an existing test" };
      } else if ((ss >= stx && ss <= etx) || (ee > stx && ee <= etx)) {
        return { bool: 1, msg: "This test will clash with an existing test" };
      }
    }
    return { bool: 0 };
  }

  function secOnCLick(e, index) {
    var d = axData;
    var Wssid = sidFunc(index);
    setSid(index + 1);
    setSectionName(Wssid);
    setEasy(d[Wssid].easy);
    setHard(d[Wssid].hard);
    setMed(d[Wssid].medium);
    setQs(d[Wssid].qs);

    if (d[Wssid].medium.length > 0) {
      if (index === 1) {
        setCurrentDic(CFDic);
      } else if (index === 2) {
        setCurrentDic(DDic);
      } else if (index === 3) {
        setCurrentDic(PDic);
      } else if (index == 4) {
        setCurrentDic(CDic);
      } else if (index == 5) {
        setCurrentDic(AWDic);
      } else if (index === 0) {
        setCurrentDic(aptDic);
      }
    } else {
      if (index === 1) {
        setCurrentDic({ time: CFDic.time, totalQs: 0 });
      } else if (index === 2) {
        setCurrentDic({ time: DDic.time, totalQs: 0 });
      } else if (index === 3) {
        setCurrentDic({ time: PDic.time, totalQs: 0 });
      } else if (index == 4) {
        setCurrentDic({ time: CDic.time, totalQs: 0 });
      } else if (index == 5) {
        setCurrentDic({ time: AWDic.time, totalQs: 0 });
      } else if (index === 0) {
        setCurrentDic({ time: aptDic.time, totalQs: 0 });
      }
    }

    $(e.target).addClass("sectionOnCLickToggle");

    Array.from(document.querySelectorAll(".sectionClick")).forEach(function (
      el
    ) {
      if (e.target !== el) {
        el.classList.remove("sectionOnCLickToggle");
      }
    });
  }

  $(document.getElementById("listSec")).ready(function () {
    Array.from(document.querySelectorAll(".sectionClick")).forEach(function (
      el,
      index
    ) {
      if (index + 1 === sid) {
        el.classList.add("sectionOnCLickToggle");
      }
    });
  });
  function check_MaxQS_Db(fromSub) {
    let easy_len, med_len, hard_len, isPersonality;
    if (fromSub !== undefined && fromSub !== {}) {
      easy_len = fromSub.easy;
      med_len = fromSub.medium;
      hard_len = fromSub.hard;
      isPersonality = fromSub.isPersonality;
    } else {
      easy_len = easy.length;
      med_len = med.length;
      hard_len = hard.length;
      isPersonality = false;
    }
    let min_ = Math.min(easy_len, med_len, hard_len);
    if (!isPersonality) {
      if (min_ === 0) {
        if (med_len > 0) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return min_;
      }
    } else {
      return med_len;
    }
  }
  function checkMaxQs(e) {
    e.preventDefault();
    let compare_val = check_MaxQS_Db();
    let curr_value = e.target.valueAsNumber;

    if (0 <= curr_value && curr_value <= compare_val) {
      if (sid - 1 === 1) {
        setCFDic({
          time: CurrentDic.time,
          totalQs: curr_value,
        });
      } else if (sid - 1 === 2) {
        setDDic({
          time: CurrentDic.time,
          totalQs: curr_value,
        });
      } else if (sid - 1 === 3) {
        setPDic({
          time: CurrentDic.time,
          totalQs: 35, //$,
        });
      } else if (sid - 1 == 4) {
        setCDic({
          time: CurrentDic.time,
          totalQs: 3,
        });
      } else if (sid - 1 == 5) {
        setAWDic({
          time: CurrentDic.time,
          totalQs: 3,
        });
      } else if (sid - 1 === 0) {
        setAptDic({
          time: CurrentDic.time,
          totalQs: curr_value,
        });
      }
      setCurrentDic({
        time: CurrentDic.time,
        totalQs: curr_value,
      });
    }
  }

  return (
    <>
      {isDesktopOrLaptop ? (
        <>
          <Alert
            msg={successMsg}
            setIsAlertMsgLoaded={setIsAlertSuccessMsgLoaded}
            isAlertMsgLoaded={isAlertSuccessMsgLoaded}
            type="success"
          ></Alert>
          <Alert
            msg={dangerMsg}
            setIsAlertMsgLoaded={setIsAlertDangerMsgLoaded}
            isAlertMsgLoaded={isAlertDangerMsgLoaded}
            type="danger"
          ></Alert>
          {isLoading ? (
            <Loader />
          ) : (
            <form onSubmit={saveTest}>
              <div
                className="basicRec"
                style={{
                  marginBottom: "25px",
                  minHeight: "50px",
                  padding: "15px 15px",
                }}
              >
                <Row>
                  <Col md={4}>
                    Name:{" "}
                    <input
                      type="text"
                      name="testName"
                      onChange={(e) => {
                        setTName(e.target.value);
                      }}
                      style={{ width: "80%" }}
                      placeholder="Enter Test Name"
                      required
                    ></input>
                  </Col>
                  <Col md={4}>
                    Start Time:
                    <DateTimePicker
                      className={"TimePicker"}
                      onChange={(e) => {
                        setSDate(e);
                      }}
                      value={sDate}
                      required
                    />
                  </Col>
                  <Col md={4}>
                    End Time:
                    <DateTimePicker
                      className={"TimePicker"}
                      onChange={(e) => {
                        setEDate(e);
                      }}
                      value={eDate}
                      required
                    />
                  </Col>
                </Row>
              </div>
              <Row>
                <Col md={3}>
                  {" "}
                  <div
                    className="basicRec"
                    id="listSec"
                    style={{
                      height: "420px",
                      marginTop: "15px",
                      overflow: "hidden",
                    }}
                  >
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 0)}
                        >
                          Aptitude
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 1)}
                        >
                          Computer Fundamentals
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 2)}
                        >
                          Domain
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 3)}
                        >
                          Personality
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 4)}
                        >
                          Coding
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div
                          className="sectionClick"
                          onClick={(e) => secOnCLick(e, 5)}
                        >
                          Analytical Writing
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <div
                    className="mainRec"
                    style={{
                      height: sid === 6 || sid === 4 ? 310 : 460,
                      marginTop: sid === 6 || sid === 4 ? "50px" : "0",
                    }}
                  >
                    <div
                      className="AdminSetSection"
                      style={{
                        marginBottom: sid === 6 || sid === 4 ? "70px" : "0",
                      }}
                    >
                      <div className="basicRec secNm">{sectionName}</div>
                      <Row style={{ margin: "24px 0", padding: "0px 0px" }}>
                        <Col
                          md={6}
                          className={sid === 6 || sid === 4 ? "onHoverDiv" : ""}
                          style={{ padding: "0px" }}
                          onClick={(e) => {
                            if (parseInt(sid - 1) === 5 || sid === 4) {
                              navigate("/admin/setQs", {
                                state: {
                                  type: "Medium",
                                  sectionName: sectionName,
                                  sid: sid,
                                  navArr: med,
                                },
                              });
                            }
                          }}
                        >
                          <div className="basicRec avQs">
                            Available{" "}
                            {parseInt(sid - 1) !== 5 ? "Question" : "Paragraph"}
                            {sid - 1 !== 5 && sid !== 4 && (
                              <>
                                <Row style={{ padding: "20px 10px 0px 40px" }}>
                                  <Col>
                                    <Row className="remQs">{easy.length}</Row>
                                  </Col>
                                  <Col>
                                    <Row className="remQs">{med.length}</Row>
                                  </Col>
                                  <Col>
                                    <Row className="remQs">{hard.length}</Row>
                                  </Col>
                                </Row>
                                <Row style={{ padding: "0px 15px 0px 30px" }}>
                                  <Col style={{ padding: "0px 0px 0px 15px" }}>
                                    Easy
                                  </Col>
                                  <Col>Medium</Col>
                                  <Col>
                                    <Row
                                      style={{ padding: "0px 0px 0px 15px" }}
                                    >
                                      Hard
                                    </Row>
                                  </Col>
                                </Row>
                              </>
                            )}
                            {(sid - 1 === 5 || sid === 4) && (
                              <div style={{ marginLeft: "20%" }}>
                                <Row style={{ padding: "20px 10px 0px 40px" }}>
                                  <Col>
                                    <Row
                                      className="remQs"
                                      style={{ paddingLeft: "22%" }}
                                    >
                                      {med.length}
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col md={6} style={{ padding: "0px" }}>
                          {sid - 1 !== 5 && sid !== 4 && (
                            <>
                              <Row>
                                <Col>
                                  <div
                                    className="basicRec easyMedHard onHoverDiv"
                                    style={{
                                      marginBottom: "28px",
                                      padding: "11px 10px",
                                    }}
                                    onClick={(e) => {
                                      navigate("/admin/setQs", {
                                        state: {
                                          type: "Easy",
                                          sectionName: sectionName,
                                          sid: sid,
                                          navArr: easy,
                                        },
                                      });
                                    }}
                                  >
                                    Easy
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div
                                    className="basicRec easyMedHard onHoverDiv"
                                    style={{
                                      marginBottom: "28px",
                                      padding: "11px 10px",
                                    }}
                                    onClick={(e) => {
                                      navigate("/admin/setQs", {
                                        state: {
                                          type: "Medium",
                                          sectionName: sectionName,
                                          sid: sid,
                                          navArr: med,
                                        },
                                      });
                                    }}
                                  >
                                    Medium
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div
                                    className="basicRec easyMedHard onHoverDiv"
                                    style={{ padding: "11px 10px" }}
                                    onClick={(e) => {
                                      navigate("/admin/setQs", {
                                        state: {
                                          type: "Hard",
                                          sectionName: sectionName,
                                          sid: sid,
                                          navArr: hard,
                                        },
                                      });
                                    }}
                                  >
                                    Hard
                                  </div>
                                </Col>
                              </Row>
                            </>
                          )}
                          {(parseInt(sid - 1) === 5 || parseInt(sid) === 4) && (
                            <>
                              <Row style={{ margin: "10px 0" }}>
                                <Col style={{ padding: "0px" }}>
                                  <div
                                    className="basicRec secNm"
                                    style={{
                                      margin: "0 3px 0px 3px",
                                      width: "100%",
                                      padding: "11px 10px",
                                    }}
                                  >
                                    <input
                                      type="time"
                                      title={"Minimum should be 20 seconds"}
                                      showSeconds
                                      className="timeFieldInput"
                                      id="timeFieldInput1"
                                      minTime="00:00:20"
                                      step={1}
                                      onChange={(e, value) => {
                                        var hms = e.target.value; // your input string
                                        var a = hms.split(":"); // split it at the colons
                                        var seconds =
                                          a[0] * 60 * 60 + +a[1] * 60 + +a[2];
                                        if (seconds > 19) {
                                          if (sid - 1 === 1) {
                                            setCFDic({
                                              time: e.target.value,
                                              totalQs: CurrentDic.totalQs,
                                            });
                                          } else if (sid - 1 === 2) {
                                            setDDic({
                                              time: e.target.value,
                                              totalQs: CurrentDic.totalQs,
                                            });
                                          } else if (sid - 1 === 3) {
                                            setPDic({
                                              time: e.target.value,
                                              totalQs: 35, //$,
                                            });
                                          } else if (sid - 1 == 4) {
                                            setCDic({
                                              time: e.target.value,
                                              totalQs: 3,
                                            });
                                          } else if (sid - 1 == 5) {
                                            setAWDic({
                                              time: e.target.value,
                                              totalQs: 3,
                                            });
                                          } else if (sid - 1 === 0) {
                                            setAptDic({
                                              time: e.target.value,
                                              totalQs: CurrentDic.totalQs,
                                            });
                                          }
                                          setCurrentDic({
                                            time: e.target.value,
                                            totalQs: CurrentDic.totalQs,
                                          });
                                        } else {
                                          setIsAlertDangerMsgLoaded(true);
                                          setDangerMsg(
                                            "Minimum should be 20 seconds"
                                          );
                                        }
                                      }}
                                      style={{
                                        paddingLeft: "3%",
                                        textJustify: "auto",
                                        width: "100%",
                                        color: "#293e6f",
                                        border: "none",
                                      }}
                                      value={CurrentDic.time}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ padding: "0px" }}>
                                  <div
                                    className="basicRec secNm"
                                    style={{
                                      padding: "11px 10px",
                                      margin: "20px 0px 0px 15px",
                                      width: "95%",
                                    }}
                                  >
                                    Total number of questions:{" "}
                                    <input
                                      type="number"
                                      style={{
                                        maxWidth: "60px",
                                        background: "rgba(0,0,0,0)",
                                      }}
                                      onChange={(e) => {
                                        checkMaxQs(e);
                                      }}
                                      value={
                                        sid === 6 || sid === 5 || sid === 4
                                          ? sid === 6 || sid === 5
                                            ? 3
                                            : 35 //$
                                          : CurrentDic.totalQs
                                      }
                                      disabled={
                                        sid === 6 || sid === 5 || sid === 4
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </>
                          )}
                        </Col>
                      </Row>
                      {parseInt(sid - 1) !== 5 && parseInt(sid) !== 4 && (
                        <Row style={{ margin: "44px 0" }}>
                          {" "}
                          <Col md={6} style={{ padding: "0" }}>
                            <div
                              className="basicRec easyMedHard"
                              style={{
                                marginBottom: "28px",
                                width: "90%",
                                padding: "11px 10px",
                              }}
                            >
                              <input
                                type="time"
                                title={"Minimum should be 20 seconds"}
                                showSeconds
                                className="timeFieldInput"
                                id="timeFieldInput1"
                                minTime="00:00:20"
                                step={1}
                                onChange={(e, value) => {
                                  var hms = e.target.value; // your input string
                                  var a = hms.split(":"); // split it at the colons
                                  var seconds =
                                    a[0] * 60 * 60 + +a[1] * 60 + +a[2];
                                  if (seconds > 19) {
                                    if (sid - 1 === 1) {
                                      setCFDic({
                                        time: e.target.value,
                                        totalQs: CurrentDic.totalQs,
                                      });
                                    } else if (sid - 1 === 2) {
                                      setDDic({
                                        time: e.target.value,
                                        totalQs: CurrentDic.totalQs,
                                      });
                                    } else if (sid - 1 === 3) {
                                      setPDic({
                                        time: e.target.value,
                                        totalQs: 35, //$,
                                      });
                                    } else if (sid - 1 == 4) {
                                      setCDic({
                                        time: e.target.value,
                                        totalQs: 3,
                                      });
                                    } else if (sid - 1 == 5) {
                                      setAWDic({
                                        time: e.target.value,
                                        totalQs: 3,
                                      });
                                    } else if (sid - 1 === 0) {
                                      setAptDic({
                                        time: e.target.value,
                                        totalQs: CurrentDic.totalQs,
                                      });
                                    }
                                    setCurrentDic({
                                      time: e.target.value,
                                      totalQs: CurrentDic.totalQs,
                                    });
                                  } else {
                                    setIsAlertDangerMsgLoaded(true);
                                    setDangerMsg(
                                      "Minimum time should be greater than 20 seconds"
                                    );
                                  }
                                }}
                                style={{
                                  paddingLeft: "3%",
                                  textJustify: "auto",
                                  width: "100%",
                                  color: "#293e6f",
                                  border: "none",
                                }}
                                value={CurrentDic.time}
                              />
                            </div>
                          </Col>
                          <Col style={{ padding: "0px" }}>
                            <div
                              className="basicRec secNm"
                              style={{
                                marginBottom: "28px",
                                padding: "11px 10px",
                              }}
                            >
                              Total number of questions:{" "}
                              <input
                                type="number"
                                style={{
                                  maxWidth: "60px",
                                  background: "rgba(0,0,0,0)",
                                }}
                                onChange={(e) => {
                                  checkMaxQs(e);
                                }}
                                value={
                                  sid === 6 || sid === 5 || sid === 4
                                    ? sid === 6 || sid === 5
                                      ? 3
                                      : 35 //$
                                    : CurrentDic.totalQs
                                }
                                disabled={
                                  sid === 6 || sid === 5 || sid === 4
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      )}
                    </div>

                    <Row style={{ float: "right" }}>
                      <button
                        style={{ color: "white" }}
                        className="btn scTest"
                        onClick={(e) => navigate("/admin/home")}
                      >
                        Back to Home page
                      </button>{" "}
                      <button
                        style={{ color: "white" }}
                        type="submit"
                        className="btn scTest"
                      >
                        Save
                      </button>
                    </Row>
                  </div>
                </Col>
              </Row>
            </form>
          )}
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}

export default NewTest;
