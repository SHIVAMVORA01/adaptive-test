import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { Container, Form } from "react-bootstrap";
import $ from "jquery";

function ChangePass() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFormData = Object.freeze({
    token: "",
    pass: "",
    cpass: "",
  });
  const [formData, updateFormData] = useState(initialFormData);

  useEffect(() => {
    updateFormData({
      ...formData,
      token: searchParams.get("token"),
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
            alert("Error occured");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("password should be same");
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
      <Container style={{ width: "620px", boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)", borderRadius: "40px" }}>
        <div>
          <h3 style={{ margin: "30px auto", marginBottom: "0px", paddingTop: "16px", paddingBottom: "20px", textAlign: "center", fontSize: "20px", lineHeight: "54px", fontWeight: "600", fontFamily: "Poppins", color: "#293E6F", marginTop: "15px" }}>Change Password</h3>
          <Form onSubmit={(e) => handleSubmit(e)} >
            <Form.Group>
              <Form.Label className="customBoldFont inputLabel">Password</Form.Label>
              <Form.Control 
                className="inputField"
                onChange={handleChange}
                id="password-field"
                name="pass"
                type="password"
                placeholder="Password"
                style={{ width: "100%" }}
                required
              />
              <span
                toggle="#password-field"
                className="fa fa-fw fa-eye field-icon toggle-password"
                onClick={(e) => showHide(e)}
                style={{marginTop:"-28px"}}
              ></span>
            </Form.Group>
            <Form.Group className="mt-3 mb-2" >
              <Form.Label className="customBoldFont inputLabel">Re-enter Password</Form.Label>
              <Form.Control className="inputField"
                onChange={handleChange}
                id="password-field"
                name="cpass"
                type="password"
                placeholder="Confirm Password"
                style={{ width: "100%" }}
                required
              />
                <span
                toggle="#password-field"
                className="fa fa-fw fa-eye field-icon toggle-password"
                onClick={(e) => showHide(e)}
                style={{marginTop:"-28px"}}
              ></span>
            </Form.Group>
            <div style={{ display: "flex", justifyContent: 'center' }}>
              <button type="submit" style={{ marginTop: "6%", border: "none", outline: "none", borderRadius: "5px", fontWeight: "bolder", backgroundColor: "#10B65C", fontFamily: "Poppins", padding: "5px 45px", color: "#FFFFFF" }}> Change Password </button>
            </div>
          </Form>

          <br />
        </div>
      </Container>
    </div>
  );
}

export default ChangePass;
