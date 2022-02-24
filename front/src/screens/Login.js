import React, { useState, useEffect } from "react";
import { Col, Row, Modal, Form, Container } from "react-bootstrap";
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
import { FcGoogle } from "react-icons/fc";
import Alert from "../components/Admin/Alert";
import forgotPass from "../img/forgotPass.png";
import MobileWidth from "../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function Login() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID_API_KEY;
  const navigate = useNavigate();
  const [md, setMd] = useState(false);
  const [dataUpcoming, setTDataUpcoming] = useState({});
  const [dataPresent, setTDataPresent] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [show, setShow] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertMsgLoaded, setIsAlertMsgLoaded] = useState(false);
  const [myid, setMyId] = useState(-1);
  const columnsP = [
    {
      label: "Name",
      field: "name",
    },
    {
      label: "Start",
      field: "start",
    },
    {
      label: "Duration",
      field: "duration",
    },

    {
      label: "Ends in",
      field: "ends_in",
    },
  ];
  const columnsU = [
    {
      label: "Name",
      field: "name",
    },
    {
      label: "Start",
      field: "start",
    },
    {
      label: "Duration",
      field: "duration",
    },

    {
      label: "Starts in",
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
        .get("api/admin/tests")
        .then((res) => {
          let ong = res.data.ongoing_test;
          if (ong.length > 0) {
            setMyId(ong[0].id);
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
          }
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
          mytid: myid,
        },
      })
      .then(async (res) => {
        if (res.data.exist) {
          if (res.data.allowed) {
            let adminn = res.data.admin;
            axiosInstance
              .post("token/", {
                username: formData.username,
                password: formData.password,
              })
              .then(async (res) => {
                let acc_token = "JWT " + res.data.access;
                axiosInstance.defaults.headers["Authorization"] = acc_token;
                let xx = myid;
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
                  const datax = async () =>
                    axiosInstance
                      .post(`api/results/${formData.username}`, {
                        data: { testId: xx },
                      })
                      .then((res) => {
                        localStorage.setItem("name", res.data.name);
                        localStorage.setItem("age", res.data.age);
                        localStorage.setItem("gender", res.data.gender);
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
                    datax();
                  }
                } else {
                  setIsloading(false);
                  setIsAlertMsgLoaded(true);
                  setDangerMsg("You are not allowed to Login yet.Please wait!");
                }
              });
          } else {
            setIsloading(false);
            setIsAlertMsgLoaded(true);
            setDangerMsg("You Are not allowed To attempt this Test");
          }
        } else {
          setIsloading(false);
          setIsAlertMsgLoaded(true);
          setDangerMsg("Invalid username or password");
        }
      });
  };

  const responseGoogle = async (res) => {
    navigate("/signup", { state: { data: res.profileObj } });
  };
  const error = (res) => {
    if (res.error === "idpiframe_initialization_failed") return;
    setIsAlertMsgLoaded(true);
    setDangerMsg("Attempt to log in failed");
  };

  return (
    <>
    {isDesktopOrLaptop ?<>
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
          <div>
            <Row style={{ height: "100%", margin: "0px" }}>
              <Col lg={8} style={{ backgroundColor: "white", padding: "0px" }}>
                <div className="all_content" style={{ margin: "0px 50px" }}>
                  <h5
                    style={{
                      fontStyle: " normal",
                      fontWeight: "600",
                      fontSize: "20px",
                      lineHeight: "16px",
                      textAlign: "center",
                      marginTop: "70px",
                      fontFamily: "Poppins",
                      fontColor: "#788094",
                    }}
                  >
                    Placement Test Portal
                  </h5>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "13px",
                      fontStyle: "normal",
                      fontWeight: "400",
                      lineHeight: "31px",
                      color: "#293e6f",
                      marginTop: "20px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    This proctored placement test portal is designed and
                    developed by the students for the students. It offers
                    behavioral analysis, personalized recommendations, and
                    intelligent practice. Log in to get started on your path to
                    a successful career.
                  </p>
                  <h5
                    style={{
                      textAlign: "center",
                      marginTop: "30px",
                      color: "#293e6f",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Test Schedule
                  </h5>
                  <Row
                    className="tb_margin"
                    style={{ margin: "20px 35px 20px 35px" }}
                  >
                    <Col style={{ marginRight: "0%", padding: "0px" }}>
                      {" "}
                      <div
                        style={{
                          background: "#FFFFFF",
                          border: "2px solid #E5E5E5",
                          boxSizing: "border-box",
                          borderRadius: "14px",
                        }}
                      >
                        <h6
                          style={{
                            paddingTop: "10px",
                            color: "#293e6f",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Ongoing Test
                        </h6>
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
                  <Row
                    className="tb_margin"
                    style={{ margin: "20px 35px 20px 35px" }}
                  >
                    <Col style={{ marginRight: "0%", padding: "0px" }}>
                      <div
                        style={{
                          background: "#FFFFFF",
                          border: "2px solid #E5E5E5",
                          boxSizing: "border-box",
                          borderRadius: "14px",
                        }}
                      >
                        <h6
                          style={{
                            paddingTop: "10px",
                            color: "#293e6f",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Upcoming Test
                        </h6>
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
              <Col lg={4} className="Background" style={{ padding: "3% 0 5% 0" }}
              >
                <Container
                  className="sign_in"
                  style={{
                    width: "352px",
                    height: "87%",
                    boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
                    backgroundColor: "white",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 auto",
                        padding: "4% 0",
                        textAlign: "center",
                        fontSize: "20px",
                        lineHeight: "54px",
                        fontWeight: "600",
                        fontFamily: "Poppins",
                        color: "#293E6F",
                      }}
                    >
                      Sign In
                    </h3>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            marginTop: "3%",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                          className="customBoldFont inputLabel"
                        >
                          Email Id
                        </Form.Label>
                        <Form.Control
                          className="inputField"
                          onChange={handleChange}
                          name="username"
                          type="text"
                          placeholder="alan@gmail.com"
                          style={{
                            width: "100%",
                            borderTopStyle: "none",
                            borderLeftStyle: "none",
                            borderRightStyle: "none",
                            fontSize: "13px",
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mt-3 mb-2">
                        <Form.Label
                          className="customBoldFont inputLabel"
                          style={{
                            marginTop: "3%",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Password
                        </Form.Label>
                        <Form.Control
                          className="inputField"
                          onChange={handleChange}
                          id="password-field"
                          name="password"
                          type="password"
                          placeholder="Password"
                          style={{
                            width: "100%",
                            borderTopStyle: "none",
                            borderLeftStyle: "none",
                            borderRightStyle: "none",
                            fontSize: "13px",
                          }}
                          required
                        />
                        <span
                          toggle="#password-field"
                          className="fa fa-fw fa-eye field-icon toggle-password"
                          onClick={(e) => showHide(e)}
                          style={{ marginTop: "-24px", color: "black" }}
                        ></span>
                        <label
                          onClick={() => setShow(true)}
                          style={{
                            cursor: "pointer",
                            fontFamily: "Poppins",
                            color: "rgb(3, 155, 229)",
                            fontWeight: "500",
                            marginLeft: "210px",
                            marginTop: "5%",
                            fontSize: "10px",
                          }}
                        >
                          Forgot Password?{" "}
                        </label>
                      </Form.Group>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          style={{
                            backgroundColor: "#10B65C",
                            width: "100%",
                            border: "none",
                            margin: "5% 0",
                          }}
                          type="submit"
                          className="btn btn-primary"
                        >
                          Login
                        </button>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <span
                          style={{
                            borderBottom: "1px solid rgb(224, 224, 224)",
                            flexGrow: 1,
                            display: "flex",
                          }}
                        />
                        <span
                          style={{
                            margin: "3% 6px",
                            color: "rgb(119, 119, 119)",
                            fontSize: "14px",
                          }}
                        >
                          OR
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid rgb(224, 224, 224)",
                            flexGrow: 1,
                            display: "flex",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: "13px",
                          color: "#464646",
                        }}
                      >
                        Not Registered? Sign up now{" "}
                      </div>
                      <Row
                        style={{
                          margin: "3% 0 3% 43%",
                        }}
                      >
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
                    </Form>
                  </div>
                </Container>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => navigate("/Home")}
                    style={{
                      backgroundColor: "#081466",
                      width: "40%",
                      border: "none",
                      marginTop: "6%",
                    }}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Back to home
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>:<MobileWidth />}
    </>
  );
}

export default Login;
