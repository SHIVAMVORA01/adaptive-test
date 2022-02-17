import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import $ from "jquery";
import { MDBDataTable } from "mdbreact";
import CustomTimer from "./Admin/CustomTimer";
import "../css/LoginScreen.css";
import ProtectUrl from "../components/TestScreeen/ProtectUrl";
import AdminProtectUrl from "../components/Admin/AdminProtectUrl";
import Loader from "../components/Loader";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import keys from "../components/TestScreeen/keys";
import { FcGoogle} from "react-icons/fc";
import Alert from "../components/Admin/Alert";


function Login() {
  const clientId = keys.googlecId();
  const navigate = useNavigate();
  const [md, setMd] = useState(false);
  const [dataUpcoming, setTDataUpcoming] = useState({});
  const [dataPresent, setTDataPresent] = useState({});
  const [isLoading, setIsloading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");

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
                          setDangerMsg("Already started on different device");
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
                setDangerMsg("You are not allowed to login");

              }
            });
        } else {
          setIsloading(false);
          setDangerMsg("Invalid username or password");
        }
      });
  };
  async function availabilty() {
    let aa = 0;
    await axiosInstance
      .get("http://127.0.0.1:8000/api/test/0")
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
    setDangerMsg("Attempt to log in failed");
  };

  return (
    <>
    <Alert msg={successMsg} type="success" ></Alert>
    <Alert msg={dangerMsg} type="danger" ></Alert>
      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ color: "#788094" }}>
          <Row>
            <Col>
              <div style={{ margin: "60px 60px" }}>
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
                  <Row style={{ marginTop: "35px", paddingLeft: "180px" }}>
                    <Col>
                      <button
                        style={{
                          backgroundColor: "#10B65C",
                          width: "150px",
                          border: "none",
                        }}
                        type="submit"
                        className="btn btn-primary"
                      >
                        Login 
                      </button>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "35px", paddingLeft: "200px" }}>
                    <Col style={{ marginLeft: "-60px"}} >Not Registered? Sign up now </Col>
                    <Row style={{ marginTop: "35px", paddingLeft: "55px" }}>
                      <GoogleLogin
                        render={renderProps => (
                          <button style={{width:"45px", height: "45px", backgroundColor:"rgb(255, 255, 255)",display:"inline-flex",alignItems:"center",color:"rgba(0, 0, 0, 0.54)",boxShadow:"rgb(0 0 0 / 24%) 0px 2px 2px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px", padding:"10px", borderRadius:"40%", border:"1px solid transparent", fontSize:"14px",fontWeight:"500",fontFamily:"Roboto, sans-serif"}} onClick={renderProps.onClick} disabled={renderProps.disabled}><FcGoogle style={{marginLeft: "5px"}}/></button>
                        )}
                        clientId={clientId}
                        buttonText="Google"
                        onSuccess={responseGoogle}
                        onFailure={error}
                        cookiePolicy={"single_host_origin"}
                      />
                    </Row>
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
      )}
    </>
  );
}

export default Login;
