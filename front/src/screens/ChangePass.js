import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { Container, Form } from "react-bootstrap";
import $ from "jquery";
import MobileWidth from "../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import Alert from "./../components/Admin/Alert";

function ChangePass() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFormData = Object.freeze({
    token: "",
    pass: "",
    cpass: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);

  useEffect(() => {
    axiosInstance
      .post("api/checkToken", {
        data: {
          mail: searchParams.get("user"),
          token: searchParams.get("token"),
        },
      })
      .then((res) => {
        if (res.data.exists) {
          updateFormData({
            ...formData,
            token: searchParams.get("token"),
          });
        } else {
          navigate("/logout");
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pass === formData.cpass) {
      axiosInstance
        .post(`api/changepass`, { data: formData })
        .then((res) => {
          if (res.data.exists) {
            navigate("/login");
          } else {
            setIsAlertDangerMsgLoaded(true);
            setDangerMsg("Something went wrong");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setIsAlertDangerMsgLoaded(true);
      setDangerMsg("Password and confirm password do not match");
    }
  };

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  function showHide(e) {
    $(e.target).toggleClass("fa-eye fa-eye-slash");
    var input = $($(e.target).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }

  return (
    <div>
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
          <Container
            style={{
              width: "635px",
              height: "445px",
              boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
              borderRadius: "40px",
              marginTop: "50px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "30px auto",
                  marginBottom: "0px",
                  paddingTop: "16px",
                  paddingBottom: "20px",
                  textAlign: "center",
                  fontSize: "20px",
                  lineHeight: "54px",
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  color: "#293E6F",
                  marginTop: "15px",
                }}
              >
                Create new password
              </h3>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: "normal",
                  fontSize: "15px",
                  color: "#788094",
                  textAlign: "center",
                  marginTop: "-15px",
                }}
              >
                Your new password must be different from previous used passwords
              </p>
              <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group>
                  <Form.Label
                    style={{ marginTop: "10px" }}
                    className="customBoldFont inputLabel"
                  >
                    Password
                  </Form.Label>
                  <Form.Control
                    className="inputField"
                    onChange={handleChange}
                    id="password-field-1"
                    name="pass"
                    type="password"
                    style={{ width: "100%" }}
                    required
                  />
                  <span
                    toggle="#password-field-1"
                    className="fa fa-fw fa-eye field-icon toggle-password"
                    onClick={(e) => showHide(e)}
                    style={{ marginTop: "-28px" }}
                  ></span>
                </Form.Group>
                <Form.Text id="passwordHelpBlock" muted>
                  Your password must be 8 characters.
                </Form.Text>
                <Form.Group className="mt-3 mb-2">
                  <Form.Label className="customBoldFont inputLabel">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    className="inputField"
                    onChange={handleChange}
                    id="password-field-2"
                    name="cpass"
                    type="password"
                    style={{ width: "100%" }}
                    required
                  />
                  <span
                    toggle="#password-field-2"
                    className="fa fa-fw fa-eye field-icon toggle-password"
                    onClick={(e) => showHide(e)}
                    style={{ marginTop: "-28px" }}
                  ></span>
                </Form.Group>
                <Form.Text id="passwordHelpBlock" muted>
                  Your password must be 8 characters.
                </Form.Text>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    type="submit"
                    style={{
                      marginTop: "6%",
                      border: "none",
                      outline: "none",
                      borderRadius: "5px",
                      fontWeight: "bolder",
                      backgroundColor: "#10B65C",
                      fontFamily: "Poppins",
                      padding: "5px 45px",
                      color: "#FFFFFF",
                    }}
                  >
                    {" "}
                    Reset Password{" "}
                  </button>
                </div>
              </Form>

              <br />
            </div>
          </Container>
        </>
      ) : (
        <MobileWidth />
      )}
    </div>
  );
}

export default ChangePass;
