import React, { useEffect, useState } from "react";
import { Container, FormControl, InputGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MobileWidth from "../../components/MobileWidth";
import axiosInstance from "../../axios";

function Profile() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const navigate = useNavigate();

  const [formData, updateFormData] = useState({});

  useEffect(() => {
    axiosInstance
      .get(`api/getUserData/${sessionStorage.getItem("username")}`)
      .then((res) => {
        console.log(res.data.user);
        let data = res.data.user;
        updateFormData(data);
      });

    return () => {};
  }, []);

  return (
    <div
      style={{ fontSize: "13.6px", padding: "0 60px", marginBottom: "20px" }}
    >
      {isDesktopOrLaptop ? (
        <>
          <button
            style={{
              marginLeft: "1%",
              backgroundColor: "#293E6F",
              borderRadius: "5px",
              border: "none",
              marginTop: "40px",
              marginLeft: "50px",
            }}
            className="btn btn-secondary"
            onClick={(e) => navigate("/admin/home")}
          >
            Back
          </button>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "0px",
              marginTop: "10px",
              color: "#293e6f",
              textAlign: "center",
              marginLeft: "20px",
            }}
          >
            My Profile{" "}
          </p>
          <Container
            className="customLoginBorder"
            style={{
              width: "887px",
              boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
              borderRadius: "40px",
              paddingBottom: "30px",
              marginTop: "15px",
              marginBottom: "50px",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}></div>
              <Form style={{ fontSize: "13.6px" }}>
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "45px" }}
                  controlId="formBasicEmail"
                >
                  <Form.Label>Email address </Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    disabled
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Label> Name </Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  value={formData.name}
                  disabled
                  required
                />
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "25px" }}
                  controlId="formBasicPassword"
                >
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.branch}
                    disabled
                    required
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "25px" }}
                  controlId="formBasicPassword"
                >
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.mobile}
                    disabled
                    required
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "25px" }}
                  controlId="formBasicPassword"
                >
                  <Form.Label>College</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.college}
                    disabled
                    required
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "25px" }}
                  controlId="formBasicPassword"
                >
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.age}
                    disabled
                    required
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  style={{ marginTop: "25px" }}
                  controlId="formBasicPassword"
                >
                  <Form.Label>Gender</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.gender}
                    disabled
                    required
                  />
                </Form.Group>
              </Form>
            </div>
          </Container>
        </>
      ) : (
        <MobileWidth />
      )}
    </div>
  );
}

export default Profile;
