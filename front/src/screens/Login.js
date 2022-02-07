import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import $ from "jquery";
import "../css/LoginScreen.css";
import axios from "axios";

function showHide(e) {
  $(e.target).toggleClass("fa-eye fa-eye-slash");
  var input = $($(e.target).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
}

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isMyTokenExpired = isExpired(token);

    if (!isMyTokenExpired) {
      if (localStorage.getItem("result")) {
        navigate("/result");
      } else {
        navigate("/testScreen");
      }
    }
  }, []);

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
                  navigate("/result");
                } else {
                  localStorage.setItem(
                    "test",
                    JSON.stringify({
                      username: formData.username,
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
                }
              });
          data();
        } else {
          alert("test not available");
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
        <Col style={{ padding: "0", margin: "0" }}>
          <div
            className="rectangleInstuc"
            style={{
              minHeight: "550px",
              padding: "5px 35px 30px 35px",
              margin: "0 40px",
            }}
          >
            <Row style={{ textAlign: "center", margin: "30px 0px" }}>
              <Col>
                <div id="instruc">Instructions</div>
              </Col>
            </Row>
            <Row>
              <Col>
                1. Only full-screen mode is available for students to give
                tests.
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col>
                2. If a student attempts to reduce the screen, a message will
                appear stating that the student has only 10 seconds to return to
                full-screen mode before the test is auto-submitted and the
                result page is presented.{" "}
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col>
                3. If a student refreshes the screen by accident, his progress
                is not lost. The progress will be saved, and the timer will be
                reset to where it was before being refreshed.{" "}
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col>
                4. If a student tries to switch tabs, desktops, or browsers
                during the test, a warning will appear twice, indicating that
                the screen has been changed. If the student continues to try to
                move the tab despite multiple warnings, his test will be
                auto-submitted.{" "}
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col>
                5. A student cannot take more than one test at the same time. If
                he tries to open the same test in a different tab, he will be
                instantly logged out of the one he just closed.{" "}
              </Col>
            </Row>
            <Row style={{ marginTop: "25px" }}>
              <Col>print(“ALL THE BEST”)</Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
