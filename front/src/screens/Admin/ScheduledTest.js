import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import axiosInstance from "../../axios";
import Loader from "../../components/Loader";
import "../../css/SchdlTest.css";
import Alert from "../../components/Admin/Alert";

function ScheduledTest() {
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isLoading, setIsloading] = useState(true);
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
      setIsloading(true);
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
    setIsloading(false);
  }, []);
  function clash(stx, etx, tId) {
    for (let i = 0; i < tests.length; i++) {
      if (tId === tests[i].id) continue;
      let ss = new Date(tests[i].test_start).getTime();
      let ee = new Date(tests[i].test_end).getTime();
      if (tests[i].test_name === header) {
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
    setIsloading(true);
    var cDate = new Date();
    if (valueStart <= valueEnd && valueStart > cDate) {
      console.log(valueStart);
      console.log(valueEnd);

      if (valueStart !== valueStartCheck || valueEnd !== valueEndCheck) {
        let objClash = clash(valueStart.getTime(), valueEnd.getTime(), testId);
        if (!objClash.bool) {
          axiosInstance
            .post("api/test/0", {
              data: {
                name: header,
                start: valueStart,
                end: valueEnd,
                apt: apt,
                aw: aw,
                c: c,
                cf: cf,
                p: p,
                domain: domain,
                update: true,
                delete: false,
                id: testId,
              },
            })
            .then((res) => {
              setIsloading(false);
              console.log(res);
              window.location.reload();
            })
            .catch((e) => {
              setIsloading(false);
              console.log(e);
            });
        } else {
          setIsloading(false);
          setDangerMsg("Test cannot be saved");
        }
      }
    } else {
      setIsloading(false);
      valueStart > cDate
        ? setDangerMsg("Start date cannot be greater than current date")
        : setDangerMsg("End date cannot be less than start date");
  
    }
  }
  function delTest(e) {
    setIsloading(true);
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
        setIsloading(false);
        console.log(res);
        window.location.reload();
      })
      .catch((e) => {
        setIsloading(false);
        console.log(e);
      });
  }
  function delSTest(idd) {
    if (window.confirm("Delete this test?")) {
      setIsloading(true);
      axiosInstance
        .delete(`api/test/${idd}`)
        .then((res) => {
          setIsloading(false);
          let arr = stests.filter((test) => {
            return test.id !== idd;
          });
          setSTests(arr);
        })
        .catch((e) => {
          setIsloading(false);
          console.log(e);
        });
    }
  }

  function startTest(tid) {
    setIsloading(true);
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
          localStorage.setItem("name", usern);
          localStorage.setItem("gender", "Male");
          localStorage.setItem("age", 30);
          setIsloading(false);
          navigate("/testScreen");
        })
        .catch((e) => {
          setIsloading(false);
          console.log(e);
        });
    data();
    setIsloading(false);
  }
  function onSubmitModal(e) {
    console.log(e.nativeEvent.submitter.id);
    e.preventDefault();
    if (e.nativeEvent.submitter.id === "delete_test") {
      delTest(e);
    } else {
      saveChanges(e);
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="SchdlTest">
          <Modal show={show} onHide={handleClose}>
            <form
              onSubmit={(e) => {
                onSubmitModal(e);
                e.preventDefault();
              }}
            >
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
                    <DateTimePicker
                      onChange={onChangeStart}
                      value={valueStart}
                    />
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
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={apt.qs}
                      max={apt.maxQs}
                      min={0}
                      title={
                        apt.maxQs > 0
                          ? `Can set values between 0 and ${apt.maxQs} only`
                          : "Can set value 0 only"
                      }
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setApt({
                          qs: parseInt(e.target.value),
                          time: apt.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: apt.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                  <Col md={3}>Apt Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      style={{ width: "fit-content" }}
                      min={"00:00:20"}
                      step={1}
                      defaultValue={apt.time}
                      onChange={(e) => {
                        setApt({
                          qs: apt.qs,
                          time: e.target.value,
                          avg: apt.avg,
                          maxQs: apt.maxQs,
                        });
                      }}
                      required
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>CF Qs: </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={cf.qs}
                      style={{ width: "100%" }}
                      max={cf.maxQs}
                      min={0}
                      title={
                        cf.maxQs > 0
                          ? `Can set values between 0 and ${cf.maxQs} only`
                          : "Can set value 0 only"
                      }
                      onChange={(e) => {
                        setCF({
                          qs: parseInt(e.target.value),
                          time: cf.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: cf.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                  <Col md={3}>CF Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      min={"00:00:20"}
                      step={1}
                      style={{ width: "fit-content" }}
                      defaultValue={cf.time}
                      onChange={(e) => {
                        setCF({
                          qs: cf.qs,
                          time: e.target.value,
                          avg: cf.avg,
                          maxQs: cf.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>C Qs: </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={c.qs}
                      title={`Can only set to ${c.qs}`}
                      disabled
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setC({
                          qs: parseInt(e.target.value),
                          time: c.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: c.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                  <Col md={3}>C Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      min={"00:00:20"}
                      step={1}
                      style={{ width: "fit-content" }}
                      defaultValue={c.time}
                      onChange={(e) => {
                        setC({
                          qs: c.qs,
                          time: e.target.value,
                          avg: c.avg,
                          maxQs: c.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>D Qs: </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={domain.qs}
                      max={domain.maxQs}
                      min={0}
                      title={
                        domain.maxQs > 0
                          ? `Can set values between 0 and ${domain.maxQs} only`
                          : "Can set value 0 only"
                      }
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setDomain({
                          qs: parseInt(e.target.value),
                          time: domain.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: domain.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                  <Col md={3}>D Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      min={"00:00:20"}
                      step={1}
                      style={{ width: "fit-content" }}
                      defaultValue={domain.time}
                      onChange={(e) => {
                        setDomain({
                          qs: domain.qs,
                          time: e.target.value,
                          avg: domain.avg,
                          maxQs: domain.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>P Qs: </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={p.qs}
                      max={p.maxQs}
                      min={0}
                      title={
                        p.maxQs > 0
                          ? `Can set values between 0 and ${p.maxQs} only`
                          : "Can set value 0 only"
                      }
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setP({
                          qs: parseInt(e.target.value),
                          time: p.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: p.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                  <Col md={3}>P Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      min={"00:00:20"}
                      step={1}
                      style={{ width: "fit-content" }}
                      defaultValue={p.time}
                      onChange={(e) => {
                        setP({
                          qs: p.qs,
                          time: e.target.value,
                          avg: p.avg,
                          maxQs: p.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>AW Qs: </Col>
                  <Col md={2}>
                    <input
                      type="number"
                      defaultValue={aw.qs}
                      title={`Can set value ${aw.maxQs} only`}
                      disabled
                      onChange={(e) => {
                        setAW({
                          qs: parseInt(e.target.value),
                          time: aw.time,
                          avg: Math.ceil(parseInt(e.target.value) * 2 * 0.7),
                          maxQs: aw.maxQs,
                        });
                      }}
                      style={{ width: "100%" }}
                    ></input>
                  </Col>
                  <Col md={3}>AW Time: </Col>
                  <Col md={3}>
                    <input
                      type="time"
                      min={"00:00:20"}
                      step={1}
                      style={{ width: "fit-content" }}
                      defaultValue={aw.time}
                      onChange={(e) => {
                        setAW({
                          qs: aw.qs,
                          time: e.target.value,
                          avg: aw.avg,
                          maxQs: aw.maxQs,
                        });
                      }}
                    ></input>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" type="submit" id="delete_test">
                  Delete
                </Button>
                <Button variant="primary" type="submit" id="save_changes">
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
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
                            className="fa fa-trash"
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
                            className="fa fa-eye"
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
      )}
    </>
  );
}

export default ScheduledTest;
