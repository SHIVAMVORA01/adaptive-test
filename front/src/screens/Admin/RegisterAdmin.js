import React from "react";
import { Container, FormControl, InputGroup, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function RegisterAdmin() {
  const navigate = useNavigate();
  return (
    <div>
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
        Register Admin{" "}
      </p>
      <p
        className="AdWell"
        style={{
          fontFamily: "Poppins",
          color: "#999999",
          fontWeight: "100",
          marginTop: "30px",
          fontSize: "15.4px",
          marginLeft: "60px",
          marginRight: "10px",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        {" "}
        Admins need to be registered to access the admin features of this
        portal.
      </p>

      <Container
        className="customLoginBorder"
        style={{
          width: "887px",
          height: "630px",
          boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
          borderRadius: "40px",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}></div>
          <p
            style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "18.4px",
              color: "#293E6F",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Register
          </p>
          <Form style={{ fontSize: "13.6px" }}>
            <Form.Group
              className="mb-3"
              style={{ marginTop: "25px" }}
              controlId="formBasicEmail"
            >
              <Form.Label>Email address </Form.Label>
              <Form.Control type="email" required />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Label> Name </Form.Label>
            <Form.Control name="name" type="text" required />
            <Form.Group
              className="mb-3"
              style={{ marginTop: "25px" }}
              controlId="formBasicPassword"
            >
              <Form.Label>Department</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ marginTop: "25px" }}
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                name="pass"
                id="password-field"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ marginTop: "25px" }}
              controlId="formBasicPassword"
            >
              <Form.Label> Confirm password</Form.Label>
              <Form.Control
                type="password"
                required
                name="cpass"
                id="password-field"
              />
            </Form.Group>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                style={{
                  marginTop: "5%",
                  border: "none",
                  outline: "none",
                  borderRadius: "5px",
                  fontWeight: "normal",
                  backgroundColor: "#10B65C",
                  fontFamily: "Poppins",
                  padding: "5px 45px",
                  color: "#FFFFFF",
                }}
              >
                Register
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default RegisterAdmin;
