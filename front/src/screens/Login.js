import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import $ from "jquery";
import "../css/LoginScreen.css";
import axios from "axios";

function Login() {
  const [utests, setUTests] = useState([]);
  const [stests, setSTests] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);

    if (!isMyTokenExpired) {
      if (localStorage.getItem("result")) {
        navigate("/result");
      } else {
        navigate("/details");
      }
    }
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
          if (!res.data.admin) {
            axiosInstance
              .post("token/", {
                username: formData.username,
                password: formData.password,
              })
              .then(async (res) => {
                let xx = await availabilty();
                if (xx !== -1) {
                  localStorage.setItem("testId", xx); //imp
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
                        if (res.data.resultExists) {
                          if(res.data.end){
                            navigate("/result");
                          }
                          else{
                            alert("Already started on different device");
                            navigate("/logout");
                          }
                        } else {
                          navigate("/details");
                        }
                      });
                  data();
                } else {
                  alert("test not available");
                }
              });
          } else {
            navigate("/admin/home");
          }
        } else {
          alert("User Doesn't exists");
        }
      });
  };
  async function availabilty() {
    let aa = 0;
    await axios
      .get("http://127.0.0.1:8000/api/test/0")
      .then((res) => {
        aa = res.data.testId;
      })
      .catch((e) => {
        console.log(e);
      });
    return parseInt(aa);
  }
  return (
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
              <Row style={{ marginTop: "35px", paddingLeft: "200px" }}>
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
                    Start Test
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        </Col>
        <Col style={{ padding: "0", margin: "0"}}>
          <div>
          <Row style={{ margin: "0 0 0 10%" }}>
        <Col style={{ marginRight: "0%", height:"900px"}}>
          {" "}
          <div
            className="basicRec"
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
                      boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                      borderRadius: "10px",
                    }}
                  >
                    <Col>
                    <button
                      type="button"           
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
                        onClick={() => {}}
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
      </Col>
      </Row>
      </div>
  
  );
}

export default Login;
