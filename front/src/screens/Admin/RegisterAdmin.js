import { useNavigate, useLocation } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import MobileWidth from "../../components/MobileWidth";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import {
  Container,
  FormControl,
  InputGroup,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Alert from "../../components/Admin/Alert";
import Loader from "../../components/Loader";
import createFilterOptions from "react-select-fast-filter-options";
import Select from "react-select";
import getGraduationYears from "../../components/TestScreeen/graduationYears";

function RegisterAdmin() {
  const [isLoading, setIsloading] = useState(true);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const filterOptions = createFilterOptions(colleges);
  const filterOptions2 = createFilterOptions(departments);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        Admins need to be registered to access the admin features of this
        portal.
      </Popover.Body>
    </Popover>
  );
  const navigate = useNavigate();
  const initialFormData = Object.freeze({
    pass: "",
    cpass: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    mobileNo: "",
    percent_10_std: 1,
    percent_12_std: 1,
    college: "",
    branch: "",
    graduationYear: 1,
    avgCGPA: 1,
    backlogs: 1,
    internships: 1,
    superuser: false,
    admin: true,
  });
  const [formData, updateFormData] = useState(initialFormData);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.pass === formData.cpass) {
      setIsloading(false);
      axiosInstance
        .post(`api/newuser`, { data: formData })
        .then((res) => {
          setIsloading(true);
          if (res.data.exists) {
            setIsAlertDangerMsgLoaded(true);
            setDangerMsg("The user is already registered");
          } else {
            navigate("/admin/home");
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
    if (e.target.name !== "") {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  useEffect(() => {
    const list = async () =>
      await axiosInstance
        .get("api/const")
        .then((res) => {
          setColleges(res.data.colleges);
          setDepartments(res.data.departments);
        })
        .catch((e) => console.log(e));
    list();
    setIsloading(false);
  }, []);
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
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              overlay={popover}
            >
              <button
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                  marginLeft: "0px",
                  padding: "0px",
                }}
              >
                <FiInfo
                  className="info"
                  style={{
                    height: "15px",
                    width: "15px",
                    marginTop: "5px",
                  }}
                />
              </button>
            </OverlayTrigger>
          </p>

          <Container
            className="customLoginBorder"
            style={{
              width: "887px",
              height: "630px",
              boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
              borderRadius: "40px",
              marginTop: "30px",
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
              <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label>Email address </Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                    value={formData.email}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Name </Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                    value={formData.name}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    name="pass"
                    id="password-field"
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder=" Confirm password"
                    onChange={handleChange}
                    required
                    name="cpass"
                    id="password-field"
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Age </Form.Label>
                  <Form.Control
                    type="number"
                    onChange={handleChange}
                    placeholder="age"
                    name="age"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Gender </Form.Label>
                  <Form.Select onChange={handleChange} name="gender" required>
                    <option selected value="">
                      Select...
                    </option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Phone Number </Form.Label>
                  <InputGroup hasValidation className="mb-3">
                    <InputGroup.Text>+91</InputGroup.Text>
                    <FormControl
                      name="mobileNo"
                      type="text"
                      placeholder="Mobile Number"
                      onChange={handleChange}
                      pattern="[7-9]{1}[0-9]{9}"
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> College </Form.Label>
                  <Select
                    name="college"
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        ["college"]: e.label,
                      });
                    }}
                    filterOptions={filterOptions}
                    options={colleges}
                  />
                </Form.Group>
                <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                  <Form.Label> Branch </Form.Label>
                  <Select
                    name="branch"
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        ["branch"]: e.label,
                      });
                    }}
                    filterOptions={filterOptions2}
                    options={departments}
                  />
                </Form.Group>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Form.Check
                    style={{ border: "1px black" }}
                    value={formData.superuser}
                    name="superuser"
                    onChange={(e) => {
                      updateFormData({
                        ...formData,
                        ["superuser"]: !formData.superuser,
                      });
                    }}
                    type="checkbox"
                    class="custom-control-label"
                    id="custom-switch"
                    label="Check this switch"
                  />
                  <button
                    type="submit"
                    style={{
                      marginTop: "5%",
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
                    Login
                  </button>
                </div>
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

export default RegisterAdmin;
