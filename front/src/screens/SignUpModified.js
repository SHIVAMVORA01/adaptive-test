import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { Container, FormControl, InputGroup, Form } from "react-bootstrap";
import Alert from "../components/Admin/Alert";
import Loader from "../components/Loader";
import createFilterOptions from "react-select-fast-filter-options";
import Select from "react-select";
import { useMediaQuery } from "react-responsive";
import MobileWidth from "../components/MobileWidth";
import getGraduationYears from "../components/TestScreeen/graduationYears";
import ConfirmDialogBox from "../components/ConfirmDialogBox";

function SignUpModified() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const initialFormData = Object.freeze({
    pass: "",
    cpass: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    mobileNo: "",
    percent_10_std: "",
    percent_12_std: "",
    college: "",
    branch: "",
    graduationYear: "",
    avgCGPA: "",
    backlogs: "",
    internships: "",
    admin: false,
    superuser: false,
  });
  const [formData, updateFormData] = useState(initialFormData);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const filterOptions = createFilterOptions(colleges);
  const filterOptions2 = createFilterOptions(departments);
  const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
  const [argConfirmModal, setArgConfirmModal] = useState();
  const [confirm_yes_func, set_confirm_yes_func] = useState();
  const [confirm_no_func, set_confirm_no_func] = useState();
  const [confirm_dialog_msg, set_confirm_dialog_msg] = useState("");
  useEffect(() => {
    const check = async () =>
      await axiosInstance
        .get("api/newuser", { params: { email: location.state.data.email } })
        .then((res) => {
          if (res.data.exists) {
            set_confirm_yes_func(() => onYes);
            set_confirm_no_func(() => {});
            set_confirm_dialog_msg("User is already registered");
            setShowConfirmDialogBox(true);
          } else {
            updateFormData({
              ...formData,
              name: location.state.data.name,
              email: location.state.data.email,
            });
          }
        })
        .catch((e) => console.log(e));

    const list = async () =>
      await axiosInstance
        .get("api/const")
        .then((res) => {
          setColleges(res.data.colleges);
          setDepartments(res.data.departments);
        })
        .catch((e) => console.log(e));
    check();
    list();
    setIsloading(false);
  }, []);

  function onYes() {
    navigate("/login");
  }
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
          }
          navigate("/login");
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

  return (
    <>
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
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <ConfirmDialogBox
                showConfirmDialogBox={showConfirmDialogBox}
                setShowConfirmDialogBox={setShowConfirmDialogBox}
                title={"User Exists"}
                confirm_no={confirm_no_func}
                confirm_yes={confirm_yes_func}
                arg={argConfirmModal}
                msg={confirm_dialog_msg}
                onlyOk={true}
              />
              <Container
                className="customLoginBorder"
                style={{
                  width: "887px",
                  height: "1660px",
                  boxShadow: "1.5px 1.5px 7px 3px rgba(0,0,0,0.2)",
                  borderRadius: "40px",
                }}
              >
                <div>
                  <div
                    style={{ display: "flex", justifyContent: "center" }}
                  ></div>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "24px",
                      color: "#293E6F",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    Sign Up
                  </p>
                  <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label>Email address </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                        required
                        value={formData.email}
                        disabled
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
                        type="text"
                        onChange={handleChange}
                        placeholder="age"
                        name="age"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> Gender </Form.Label>
                      <Form.Select
                        onChange={handleChange}
                        name="gender"
                        required
                      >
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
                      <Form.Label> 10th percentage </Form.Label>
                      <Form.Control
                        type="number"
                        type="text"
                        placeholder="10th percentage"
                        onChange={handleChange}
                        name="percent_10_std"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> 12th percentage </Form.Label>
                      <Form.Control
                        type="number"
                        type="text"
                        placeholder="12th percentage"
                        onChange={handleChange}
                        name="percent_12_std"
                        required
                      />
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
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> Year of graduation </Form.Label>
                      <Form.Select
                        onChange={handleChange}
                        name="graduationYear"
                        required
                      >
                        {getGraduationYears().map((year, index) => {
                          return (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> Average C.G.P.A </Form.Label>
                      <Form.Control
                        type="number"
                        type="text"
                        placeholder=" C.G.P.A "
                        onChange={handleChange}
                        name="avgCGPA"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> Number of Backlogs </Form.Label>
                      <Form.Control
                        type="number"
                        type="text"
                        placeholder=" Backlogs "
                        onChange={handleChange}
                        name="backlogs"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ marginTop: "25px" }}>
                      <Form.Label> Number of internships </Form.Label>
                      <Form.Control
                        type="number"
                        type="text"
                        placeholder="internship"
                        onChange={handleChange}
                        name="internships"
                        required
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
            </div>
          )}
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}

export default SignUpModified;
