import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import "../../css/SchdlTest.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";
import axiosInstance from "../../axios";

function ScheduledTest() {
  const [stests, setSTests] = useState([]);
  const [utests, setUTests] = useState([]);
  const [show, setShow] = useState(false);
  const [tests, setTests] = useState([]);
  const [header, setHeader] = useState();
  const [testId, setTestId] = useState();

  const handleClose = () => setShow(false);

  const [valueStart, onChangeStart] = useState(new Date());
  const [valueEnd, onChangeEnd] = useState(new Date());

  const [valueStartCheck, onChangeStartCheck] = useState(new Date());
  const [valueEndCheck, onChangeEndCheck] = useState(new Date());

  const [apt, setApt] = useState({});
  const [cf, setCF] = useState({});
  const [c, setC] = useState({});
  const [domain, setDomain] = useState({});
  const [p, setP] = useState({});
  const [aw, setAW] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      await axiosInstance
        .get("http://127.0.0.1:8000/api/admin/tests")
        .then((res) => {
          console.log(res.data);
          let ar = [];
          setSTests(res.data.stests);
          setUTests(res.data.utests);
          setTests(ar.concat(res.data.stests, res.data.utests));
        })
        .catch((e) => {
          console.log(e);
        });
    };

    data();
  }, []);
  function clash(stx, etx, tId) {
    for (let i = 0; i < tests.length; i++) {
      if (tId === tests[i].id) continue;
      let ss = new Date(tests[i].test_start).getTime();
      let ee = new Date(tests[i].test_end).getTime();

      if ((stx >= ss && stx <= ee) || (etx >= ss && etx <= ee)) {
        return 1;
      } else if ((ss >= stx && ss <= etx) || (ee > stx && ee <= etx)) {
        return 1;
      }
    }
    return 0;
  }
  function upcomingTest(e, test) {
    let s = new Date(test.test_start);
    let s1 = new Date(test.test_end);

    setHeader(test.test_name);
    setApt(test.apt);
    setC(test.c);
    setCF(test.cf);
    setDomain(test.dom);
    setP(test.p);
    setAW(test.aw);
    let date = s.toLocaleDateString();
    console.log(date);
    console.log(s);

    date = date.split("/");
    let time = s.toTimeString().split(" ")[0];
    time = time.split(":");
    console.log(
      new Date(date[2], date[0] - 1, date[1], time[0], time[1], time[2])
    );
    onChangeStart(
      new Date(date[2], date[0] - 1, date[1], time[0], time[1], time[2])
    );
    onChangeStartCheck(
      new Date(date[2], date[0] - 1, date[1], time[0], time[1], time[2])
    );
    setTestId(test.id);

    let datey = s1.toLocaleDateString();
    datey = datey.split("/");
    let timey = s1.toTimeString().split(" ")[0];
    timey = timey.split(":");
    onChangeEnd(
      new Date(datey[2], datey[0] - 1, datey[1], timey[0], timey[1], timey[2])
    );
    onChangeEndCheck(
      new Date(datey[2], datey[0] - 1, datey[1], timey[0], timey[1], timey[2])
    );
    setShow(true);
  }
  function saveChanges(e) {
    e.preventDefault();
    var cDate = new Date();
    if (valueStart <= valueEnd && valueStart > cDate) {
      console.log(valueStart);
      console.log(valueEnd);

      if (valueStart !== valueStartCheck || valueEnd !== valueEndCheck) {
        if (!clash(valueStart.getTime(), valueEnd.getTime(), testId)) {
          axiosInstance
            .post("api/test/0", {
              data: {
                name: header,
                start: valueStart,
                end: valueEnd,
                update: true,
                delete: false,
                id: testId,
              },
            })
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          alert("This test will clash with an existing test");
        }
      }
      handleClose(e);
    } else {
      valueStart > cDate
        ? alert("ENDATE should be GREATER than start Date")
        : alert("start Date time should be greater than current date time");
    }
  }
  function delTest(e) {
    axiosInstance
      .delete(`api/test/${testId}`, {
        data: {
          name: header,
          start: valueStart,
          end: valueEnd,
          delete: true,
          id: testId,
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function delSTest(idd) {
    if (window.confirm("Delete this test?")) {
      axiosInstance
        .delete(`api/test/${idd}`)
        .then((res) => {
          let arr = stests.filter((test) => {
            return test.id !== idd;
          });
          setSTests(arr);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  function startTest(tid) {
    localStorage.setItem("testId", tid);
    var ob = new Date();
    var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
    var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
    var s = (ob.getMinutes() < 10 ? "0" : "") + ob.getSeconds();
    var usern = localStorage.getItem("username");
    const data = async () =>
      axiosInstance
        .post(`api/results/${usern}`, {
          data: { testId: tid },
        })
        .then((res) => {
          localStorage.setItem(
            "test",
            JSON.stringify({
              username: usern,
              STime: Date(),
              strtTime: +h + ":" + m + ":" + s,
              FSTimer: "10",
              question: [],
              marks: [],
              currentQsNo: 1,
            })
          );
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + localStorage.getItem("access_token");
          navigate("/testScreen");
        })
        .catch((e) => console.log(e));
    data();
  }

  return (
    <div className="SchdlTest">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h3>Edit</h3>
        </Modal.Header>
        <Modal.Body>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>Test Name: </Col>
            <Col md={9}>
              <input
                type="string"
                defaultValue={header}
                onChange={(e) => {
                  setHeader(e.target.value);
                }}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>Start Time:</Col>
            <Col md={9}>
              <DateTimePicker onChange={onChangeStart} value={valueStart} />
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>End Time:</Col>
            <Col md={9}>
              <DateTimePicker
                onChange={(e) => {
                  onChangeEnd(e);
                }}
                value={valueEnd}
              />
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>Apt Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={apt.qs}
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>Apt Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={apt.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>CF Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={cf.qs}
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>CF Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={cf.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>C Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={c.qs}
                disabled
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>C Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={c.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>D Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={domain.qs}
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>D Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={domain.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>P Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={p.qs}
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>P Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={p.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
          <Row style={{ margin: "2% 0" }}>
            <Col md={3}>AW Qs: </Col>
            <Col md={3}>
              <input
                type="number"
                defaultValue={aw.qs}
                disabled
                style={{ width: "100%" }}
                onChange={(e) => {}}
              ></input>
            </Col>
            <Col md={3}>AW Time: </Col>
            <Col md={3}>
              <input
                type="time"
                style={{ width: "fit-content" }}
                defaultValue={aw.time}
                onChange={(e) => {}}
              ></input>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={(e) => {
              delTest(e);
            }}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              saveChanges(e);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <button
        style={{
          marginLeft: "1%",
          backgroundColor: "#293E6F",
          borderRadius: "5px",
          border: "none",
        }}
        className="btn btn-secondary"
        onClick={(e) => navigate("/admin/home")}
      >
        Back
      </button>
      <Row style={{ margin: "0 0 0 10%" }}>
        <Col md={6} style={{ marginRight: "0%" }}>
          {" "}
          <div
            className="basicRec"
            style={{ minHeight: window.screen.height - 400, width: "90%" }}
          >
            <h4 style={{ paddingLeft: "30%", paddingTop: "10px" }}>
              Scheduled Test
            </h4>
            <div className="lineThrough"></div>
            <div
              className="scrollbar"
              id="style-4"
              style={{ height: window.screen.height - 480 }}
            >
              {stests.map((t, index) => {
                return (
                  <Row
                    style={{
                      backgroundColor: "white",
                      borderColor: "#F0F0F0",
                      marginBottom: "1px",
                      boxShadow:
                        "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                      borderRadius: "10px",
                    }}
                  >
                    <Col>
                      <button
                        type="button"
                        onClick={(e) => {
                          navigate("/admin/viewScheduledTest", {
                            state: {
                              id: t.id,
                              name: t.test_name,
                              start: t.test_start,
                              end: t.test_end,
                            },
                          });
                        }}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderColor: "#F0F0F0",
                          marginBottom: "1px",
                          border: "none",
                        }}
                        key={index}
                      >
                        {t.test_name}
                      </button>
                    </Col>
                    <Col md={1}>
                      <i
                        onClick={() => delSTest(t.id)}
                        class="fa fa-trash"
                        style={{
                          backgroundColor: "white",
                          color: "red",
                          float: "right",
                          marginRight: "15px",
                          marginTop: "10px",
                        }}
                      ></i>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Col>
        <Col md={6} style={{ marginRight: "0%" }}>
          {" "}
          <div
            className="basicRec"
            style={{
              minHeight: window.screen.height - 400,
              maxHeight: window.screen.height - 400,
              width: "90%",
            }}
          >
            <h4 style={{ paddingLeft: "30%", paddingTop: "10px" }}>
              Upcoming Test
            </h4>
            <div className="lineThrough"></div>
            <div
              className="scrollbar"
              id="style-4"
              style={{ height: window.screen.height - 480 }}
            >
              {utests.map((t, index) => {
                return (
                  <Row
                    style={{
                      backgroundColor: "white",
                      borderColor: "#F0F0F0",
                      marginBottom: "1px",
                      boxShadow:
                        "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                      borderRadius: "10px",
                    }}
                  >
                    <Col>
                      <button
                        type="button"
                        onClick={(e) => upcomingTest(e, t)}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderColor: "#F0F0F0",
                          marginBottom: "1px",
                          border: "none",
                        }}
                        key={index}
                      >
                        {t.test_name}
                      </button>
                    </Col>
                    <Col md={1}>
                      <i
                        onClick={() => {
                          startTest(t.id);
                        }}
                        class="fa fa-eye"
                        style={{
                          backgroundColor: "white",
                          color: "green",
                          float: "right",
                          marginRight: "15px",
                          marginTop: "10px",
                        }}
                      ></i>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ScheduledTest;
