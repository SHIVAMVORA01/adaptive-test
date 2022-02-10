import React, { useState, useEffect } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import $ from "jquery";
import "../css/LoginScreen.css";

function DetailScreen() {
  const initialFormData = Object.freeze({
    username: localStorage.getItem("username"),
    name: "",
    email: "",
    age: "",
    gender: "",
    mobileNo: "",
    percent_10_std: "",
    percent_12_std: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
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
  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axiosInstance
      .post(`api/createUser`, { data: formData })
      .then(async (res) => {
        console.log(res);
        var ob = new Date();
        var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
        var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
        var s = (ob.getMinutes() < 10 ? "0" : "") + ob.getSeconds();
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
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div style={{ color: "#788094" }}>
      <Row>
        <Col>
          <div style={{ margin: "5px 60px" }}>
            <Row>
              <Col>
                <div id="title">Please fill in your Details</div>
              </Col>
            </Row>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Row style={{ marginTop: "10px" }}>
                <Col>
                  <input
                    className="loginInpRec"
                    onChange={handleChange}
                    name="name"
                    type="text"
                    placeholder="* Name"
                    style={{ width: "100%" }}
                    required
                  ></input>
                </Col>
              </Row>
              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <input
                    className="loginInpRec"
                    onChange={handleChange}
                    name="email"
                    type="email"
                    placeholder="* Email Id"
                    style={{ width: "100%" }}
                    required
                  ></input>
                </Col>
              </Row>
              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <input
                    className="loginInpRec"
                    onChange={handleChange}
                    name="age"
                    type="number"
                    placeholder="* Age"
                    style={{ width: "100%" }}
                    required
                  ></input>
                </Col>
              </Row>
              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <Form.Select
                    className="loginInpRec"
                    id="genderSelect"
                    style={{ color: "grey" }}
                    onChange={(e) => {
                      handleChange(e);
                      document.getElementById(e.target.id).style.color =
                        e.target.value !== "" ? "black" : "grey";
                    }}
                    name="gender"
                    required
                  >
                    <option value="">* Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <InputGroup
                    className="loginInpRec"
                    style={{ padding: "0", minHeight: "20px" }}
                    hasValidation
                  >
                    <InputGroup.Text style={{ color: "grey" }}>
                      +91
                    </InputGroup.Text>
                    <Form.Control
                      name="mobileNo"
                      type="text"
                      placeholder="Mobile Number"
                      onChange={handleChange}
                      pattern="[7-9]{1}[0-9]{9}"
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <input
                    className="loginInpRec"
                    onChange={handleChange}
                    name="percent_10_std"
                    placeholder="* 10th percentage"
                    type="number"
                    max="100"
                    style={{ width: "100%" }}
                    required
                  ></input>
                </Col>
              </Row>
              <Row style={{ marginTop: "25px" }}>
                <Col>
                  <input
                    className="loginInpRec"
                    onChange={handleChange}
                    name="percent_12_std"
                    placeholder="* 12th percentage"
                    type="number"
                    max="100"
                    style={{ width: "100%" }}
                    required
                  ></input>
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

export default DetailScreen;
