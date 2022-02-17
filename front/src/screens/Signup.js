import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state.data);
  const initialFormData = Object.freeze({
    name: "",
    email: "",
    pass: "",
    cpass: "",
  });
  const [formData, updateFormData] = useState(initialFormData);

  useEffect(() => {
    const check = async () =>
      await axiosInstance
        .get("api/newuser", { params: { email: location.state.data.email } })
        .then((res) => {
          if (res.data.exists) {
            alert("email already exists");
            navigate("/login");
          } else {
            updateFormData({
              ...formData,
              name: location.state.data.name,
              email: location.state.data.email,
            });
          }
        })
        .catch((e) => console.log(e));
    check();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pass === formData.cpass) {
      axiosInstance
        .post(`api/newuser`, { data: formData })
        .then((res) => {
          if (res.data.exists) {
            alert("email taken");
            navigate("/login");
          } else {
            navigate("/login");
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

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          className="loginInpRec"
          onChange={handleChange}
          name="email"
          type="email"
          // placeholder="* Email Id"
          style={{ width: "100%", background: "grey" }}
          required
          value={formData.email}
          disabled
        ></input>
        <input
          className="loginInpRec"
          onChange={handleChange}
          name="name"
          type="text"
          placeholder="* Name"
          style={{ width: "100%" }}
          value={formData.name}
          required
        ></input>
        <input
          className="loginInpRec"
          onChange={handleChange}
          id="password-field"
          name="pass"
          type="password"
          placeholder="Password"
          style={{ width: "100%" }}
          required
        ></input>
        <input
          className="loginInpRec"
          onChange={handleChange}
          id="password-field"
          name="cpass"
          type="password"
          placeholder="Confirm Password"
          style={{ width: "100%" }}
          required
        ></input>

        <button
          style={{
            backgroundColor: "#10B65C",
            width: "150px",
            border: "none",
          }}
          type="submit"
          className="btn btn-primary"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
