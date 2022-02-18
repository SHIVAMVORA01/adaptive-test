import React, { useState, useEffect } from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import $ from "jquery";
import { MDBDataTable } from "mdbreact";
import CustomTimer from "./Admin/CustomTimer";
import "../css/LoginScreen.css";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import AdminProtectUrl from "../components/Admin/AdminProtectUrl";
import Loader from "../components/Loader";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import keys from "../components/TestScreeen/keys";
import { FcGoogle } from "react-icons/fc";
import Alert from "../components/Admin/Alert";
import forgotPass from "../img/forgotPass.png";

function Login() {
  const clientId = keys.googlecId();
  const navigate = useNavigate();
  const [md, setMd] = useState(false);
  const [dataUpcoming, setTDataUpcoming] = useState({});
  const [dataPresent, setTDataPresent] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [show, setShow] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertMsgLoaded, setIsAlertMsgLoaded] = useState(false);
  const columnsP = [
    {
      label: "NAME",
      field: "name",
    },
    {
      label: "START",
      field: "start",
    },
    {
      label: "DURATION",
      field: "duration",
    },

    {
      label: "ENDS IN",
      field: "ends_in",
    },
  ];
  const columnsU = [
    {
      label: "NAME",
      field: "name",
    },
    {
      label: "START",
      field: "start",
    },
    {
      label: "DURATION",
      field: "duration",
    },

    {
      label: "STARTS IN",
      field: "starts_in",
    },
  ];
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);

    if (!isMyTokenExpired) {
      if (localStorage.getItem("result")) {
        setMd(true);
        navigate("/result");
      } else {
        setMd(true);
        let typeUser = localStorage.getItem("admin");
        let username = localStorage.getItem("username");
        if (typeUser === "admin" && username !== null) {
          let pathTo = ProtectUrl.protect();
          navigate(pathTo === "" ? "/admin/home" : pathTo);
        } else if (typeUser === "user" && username !== null) {
          let pathTo = AdminProtectUrl.protect();
          navigate(pathTo === "" ? "/details" : pathTo);
        }
      }
    }
    const data = async () => {
      await axiosInstance
        .get("http://127.0.0.1:8000/api/admin/tests")
        .then((res) => {
          let ong = res.data.ongoing_test;
          if (ong.length > 0)
            ong[0]["ends_in"] = (
              <CustomTimer
                isLogin={true}
                onlyS={true}
                reset={md}
                time={ong[0]["ends_in"]}
                start={!md}
                style={{ fontSize: "18px" }}
              ></CustomTimer>
            );
          let upt = res.data.upcoming_test;
          for (let x = 0; x < upt.length; x++) {
            upt[x]["starts_in"] = (
              <CustomTimer
                isLogin={true}
                onlyS={true}
                reset={md}
                time={upt[x]["starts_in"]}
                start={!md}
                style={{ fontSize: "18px" }}
              ></CustomTimer>
            );
          }
          setTDataUpcoming({ columns: columnsU, rows: upt || [] });
          setTDataPresent({ columns: columnsP, rows: ong || [] });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    data();
    setIsloading(false);
  }, []);
  function showHide(e) {
    $(e.target).toggleClass("fa-eye fa-eye-slash");
    var input = $($(e.target).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }

  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
  const [formData2, updateFormData2] = useState({ email: "" });
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);
    axiosInstance
      .post("/api/log", {
        data: {
          username: formData.username,
          password: formData.password,
        },
      })
      .then(async (res) => {
        console.log(res.data);
        if (res.data.exist) {
          let adminn = res.data.admin;
          axiosInstance
            .post("token/", {
              username: formData.username,
              password: formData.password,
            })
            .then(async (res) => {
              let acc_token = "JWT " + res.data.access;
              axiosInstance.defaults.headers["Authorization"] = acc_token;
              let xx = await availabilty(acc_token);
              if (xx !== -1 || adminn) {
                localStorage.setItem("testId", xx); //imp
                localStorage.setItem("admin", "user");
                var ob = new Date();
                var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
                var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
                var s = (ob.getMinutes() < 10 ? "0" : "") + ob.getSeconds();
                localStorage.setItem("access_token", res.data.access);
                localStorage.setItem("username", formData.username);
                localStorage.setItem("refresh_token", res.data.refresh);
                const data = async () =>
                  axiosInstance
                    .post(`api/results/${formData.username}`, {
                      data: { testId: xx },
                    })
                    .then((res) => {
                      setIsloading(false);
                      if (res.data.resultExists) {
                        if (res.data.end) {
                          setMd(true);
                          navigate("/result");
                        } else {
                          setMd(true);
                          alert("Already started on different device");
                          navigate("/logout");
                        }
                      } else {
                        setMd(true);
                        navigate("/details");
                      }
                    });
                if (adminn) {
                  localStorage.setItem("admin", "admin");
                  localStorage.removeItem("testId");
                  setMd(true);
                  navigate("/admin/home");
                } else {
                  data();
                }
              } else {
                setIsloading(false);
                setIsAlertMsgLoaded(true);
                setDangerMsg("You are not allowed to login");
              }
            });
        } else {
          setIsloading(false);
          setIsAlertMsgLoaded(true);
          setDangerMsg("Invalid username or password");
        }
      });
  };
  async function availabilty() {
    let aa = 0;
    await axiosInstance
      .get("/api/test/0")
      .then((res) => {
        aa = res.data.testId;
      })
      .catch((e) => {
        console.log(e);
      });
    return parseInt(aa);
  }

  const responseGoogle = async (res) => {
    navigate("/signup", { state: { data: res.profileObj } });
  };
  const error = (res) => {
    setIsAlertMsgLoaded(true);
    setDangerMsg("Attempt to log in failed");
  };

  return (
    <>
      <Alert
        msg={successMsg}
        setIsAlertMsgLoaded={setIsAlertMsgLoaded}
        isAlertMsgLoaded={isAlertMsgLoaded}
        type="success"
      ></Alert>
      <Alert
        msg={dangerMsg}
        setIsAlertMsgLoaded={setIsAlertMsgLoaded}
        isAlertMsgLoaded={isAlertMsgLoaded}
        type="danger"
      ></Alert>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Modal
            id="Login_page"
            show={show}
            onHide={() => setShow(false)}
            centered
          >
            <Modal.Body
              style={{ textAlign: "center", padding: "20px 20px 15px 20px" }}
            >
              <img
                src={forgotPass}
                alt="chosen"
                style={{ height: "100px", marginBottom: "20px" }}
              />
              <p
                style={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#293E6F",
                  textAlign: "center",
                }}
              >
                Did someone forget their password?
              </p>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "14px",
                  color: "#293E6F",
                  textAlign: "center",
                }}
              >
                That's ok
              </p>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "14px",
                  color: "#293E6F",
                  textAlign: "center",
                }}
              >
                Just enter the email address you've used to register with us and
                we'll send you a reset link
              </p>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  axiosInstance
                    .post("api/forgotpass", {
                      data: { email: formData2.email },
                    })
                    .then((res) => {
                      if (res.data.exists) {
                        setShow(false);
                      } else {
                        alert("Error occured");
                      }
                    })
                    .catch((e) => console.log(e));
                }}
              >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    onChange={(e) => {
                      updateFormData2({
                        ...formData2,
                        email: e.target.value,
                      });
                    }}
                    name="email"
                    type="email"
                    placeholder="Email Id"
                    style={{ width: "100%" }}
                    required
                    value={formData2.email}
                  />
                </Form.Group>
                <button
                  style={{
                    backgroundColor: "#10B65C",
                    width: "100px",
                    border: "none",
                    marginLeft: "40%",
                    marginTop: "20px",
                  }}
                  type="submit"
                  className="btn btn-primary"
                >
                  Send
                </button>
              </Form>
            </Modal.Body>
          </Modal>
          <div style={{ color: "#788094" }}>
            <Row>
              <Col>
                <div style={{ margin: "45px 60px" }}>
                  <Row>
                    <Col>
                      <div id="title">Placement Aptitude Portal</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div id="subTitle">
                        Dwarkadas J. Sanghvi College of Engineering
                      </div>
                    </Col>
                  </Row>
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <Row style={{ marginTop: "70px" }}>
                      <Col>
                        <input
                          className="loginInpRec"
                          onChange={handleChange}
                          name="username"
                          type="text"
                          placeholder="Username"
                          style={{ width: "100%" }}
                        ></input>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "25px" }}>
                      <Col>
                        <input
                          className="loginInpRec"
                          onChange={handleChange}
                          id="password-field"
                          name="password"
                          type="password"
                          placeholder="Password"
                          style={{ width: "100%" }}
                        ></input>
                        <span
                          toggle="#password-field"
                          className="fa fa-fw fa-eye field-icon toggle-password"
                          onClick={(e) => showHide(e)}
                        ></span>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "3px" }}>
                      <Col>
                        <div
                          style={{
                            textAlign: "right",
                            marginTop: "10px",
                            marginBottom: "30px",
                          }}
                        >
                          <label
                            onClick={() => setShow(true)}
                            style={{
                              cursor: "pointer",
                              fontFamily: "Poppins",
                              color: "#788094",
                              fontWeight: "500",
                              marginRight: "10px",
                              marginTop: "2px",
                              fontSize: "15px",
                            }}
                          >
                            Forgot Password{" "}
                          </label>
                        </div>
                        <button
                          style={{
                            backgroundColor: "#10B65C",
                            width: "150px",
                            border: "none",
                            marginLeft: "36%",
                          }}
                          type="submit"
                          className="btn btn-primary"
                        >
                          Start Test
                        </button>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: "40px", marginLeft: "29%" }}>
                      Not Registered? Sign up now{" "}
                    </Row>
                    <Row style={{ marginTop: "10px", marginLeft: "45%" }}>
                      <GoogleLogin
                        render={(renderProps) => (
                          <button
                            style={{
                              width: "45px",
                              height: "45px",
                              backgroundColor: "rgb(255, 255, 255)",
                              color: "rgba(0, 0, 0, 0.54)",
                              boxShadow:
                                "rgb(0 0 0 / 24%) 0px 2px 2px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px",
                              padding: "0px 0 2px 2px",
                              borderRadius: "50px",
                              border: "1px solid transparent",
                            }}
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                          >
                            <FcGoogle
                              style={{
                                height: "30px",
                                width: "30px",
                                marginLeft: "5px",
                              }}
                            />
                          </button>
                        )}
                        clientId={clientId}
                        buttonText="Google"
                        onSuccess={responseGoogle}
                        onFailure={error}
                        cookiePolicy={"single_host_origin"}
                      />
                    </Row>
                  </form>
                </div>
              </Col>
              <Col style={{ padding: "0", marginTop: "40px" }}>
                <div>
                  <Row style={{ margin: "0 0 20px 10%" }}>
                    <Col style={{ marginRight: "0%" }}>
                      {" "}
                      <div className="basicRec">
                        <h5
                          style={{
                            paddingTop: "10px",
                            color: "#293e6f",
                            textAlign: "center",
                          }}
                        >
                          Ongoing Test
                        </h5>
                        <MDBDataTable
                          striped
                          bordered
                          noBottomColumns
                          hover
                          searching={false}
                          displayEntries={false}
                          entries={1}
                          pagesAmount={1}
                          paging={false}
                          noRecordsFoundLabel={"No Ongoing Test"}
                          data={dataPresent}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ margin: "0 0 0 10%" }}>
                    <Col style={{ marginRight: "0%" }}>
                      {" "}
                      <div className="basicRec">
                        <h5
                          style={{
                            paddingTop: "10px",
                            color: "#293e6f",
                            textAlign: "center",
                          }}
                        >
                          Upcoming Test
                        </h5>
                        <MDBDataTable
                          striped
                          bordered
                          noBottomColumns
                          hover
                          searching={false}
                          displayEntries={false}
                          entries={4}
                          pagesAmount={1}
                          paging={false}
                          noRecordsFoundLabel={"No Upcoming Test"}
                          data={dataUpcoming}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

export default Login;
