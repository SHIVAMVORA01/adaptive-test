import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Modal, Form, Button } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import axiosInstance from "../../axios";
import { MDBDataTable } from "mdbreact";
import { MDBInput } from "mdbreact";
import { CSVLink } from "react-csv";
import Loader from "../../components/Loader";
import { SiMicrosoftexcel } from "react-icons/si";
import ConfirmDialogBox from "../../components/ConfirmDialogBox";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import $ from "jquery";
import { AiFillMail } from "react-icons/ai";
import Alert from "../../components/Admin/Alert";

function ViewSchdlTest() {
  const initialFormData = Object.freeze({
    subject: "",
    body: "",
  });
  const [formData, updateFormData] = useState(initialFormData);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [data, setTData] = useState({ columns: [], rows: [] });
  const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
  const [argConfirmModal, setArgConfirmModal] = useState();
  const [sendMail, setSendMail] = useState(false);
  const [areAllChecked, setAreAllChecked] = useState(false);
  const [dangerMsg, setDangerMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  // let addBtn;
  const columns = [
    {
      label: (
        <MDBInput
          label=" "
          type="checkbox"
          id="selectAllCheckboc"
          title="Select all"
          onChange={(e) => {
            checkAllHandler(e.target.checked);
          }}
        />
      ),
      field: "checkBtn",
    },
    {
      label: "Student",
      field: "name",
    },
    {
      label: "Start Time",
      field: "sdate",
    },
    {
      label: "End Time",
      field: "edate",
    },
    {
      label: "Aptitude",
      field: "apt",
    },
    {
      label: "Fundamentals",
      field: "fund",
    },
    {
      label: "Coding",
      field: "code",
    },
    {
      label: "Domain",
      field: "dom",
    },
    {
      label: "Analytical",
      field: "analy",
    },
    {
      label: "Marks",
      field: "marks",
    },
    {
      label: "",
      field: "addBtn",
    },
  ];
  const headers = [
    { label: "Student", key: "name" },
    { label: "Start Time", key: "sdate" },
    { label: "End Time", key: "edate" },
    { label: "Aptitude", key: "apt" },
    { label: "Fundamentals", key: "fund" },
    { label: "Coding", key: "code" },
    { label: "Domain", key: "dom" },
    { label: "Analytical", key: "analy" },
    { label: "Marks", key: "marks" },
    { label: "Delete", key: "addBtn" },
  ];

  useEffect(() => {
    setIsloading(true);
    axiosInstance
      .get(`/api/admin/resultTest/${location.state.id}`)
      .then((res) => {
        setRows(res.data.studentNameArr);
        console.log(res.data);
        setTData({
          columns: columns,
          rows: res.data.studentNameArr.map((v) => ({
            ...v,
            checkBtn: (
              <MDBInput
                label=" "
                defaultChecked={false}
                style={{ height: "10px", width: "10px" }}
                type="checkbox"
                name="checkbox_send_mail"
                className="checkbox_send_mail"
                id={"checkbox" + v.uid}
                onChange={(e) =>
                  checkAllSelected(res.data.studentNameArr.length)
                }
              />
            ),
            addBtn: (
              <button
                style={{ border: "none" }}
                onClick={() => deleteRow(v.id)}
              >
                {" "}
                <i className="fa fa-trash" style={{ color: "red" }}></i>
              </button>
            ),
          })),
        });
      });
    setIsloading(false);
  }, []);
  function deleteRow(id) {
    setArgConfirmModal(id);
    setShowConfirmDialogBox(true);
  }
  function confirm_yes(id) {
    setIsloading(true);
    axiosInstance
      .delete(`api/delres/${id}`)
      .then((res) => {
        setIsloading(false);
        let arr = data.rows.filter((ex) => {
          return ex.id !== id;
        });
        setTData({ columns: data.columns, rows: arr });
      })
      .catch((e) => {
        setIsloading(false);
        console.log(e);
      });
  }
  function confirm_no() {}
  const handleChange = (e) => {
    if (e.target.name !== "") {
      updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  function checkAllSelected(rowLength) {
    let c = $(".checkbox_send_mail:checkbox:checked").length;
    let areAllSected = parseInt(c) === parseInt(rowLength);
    setAreAllChecked(areAllSected ? true : false);
    document.getElementById("selectAllCheckboc").checked = areAllSected
      ? true
      : false;
  }
  const checkAllHandler = (val) => {
    let c = $(".checkbox_send_mail:checkbox");
    c.prop("checked", val);
    setAreAllChecked(val);
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
              <Modal
                show={sendMail}
                onHide={() => setSendMail(false)}
                aria-labelledby="send_mail"
                className="send_mail_modal"
                centered
              >
                <Form
                  style={{ fontSize: "12px" }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    let x = $(".checkbox_send_mail:checkbox:checked");
                    let userId = [];
                    let isAllSelected = 0;
                    if (!areAllChecked && x.length !== 0) {
                      x.map((xx) =>
                        userId.push(parseInt(x[xx].id.split("checkbox")[1]))
                      );
                    } else {
                      isAllSelected = 1;
                    }
                    console.log(userId);
                    console.log(x);
                    console.log(formData);
                    axiosInstance
                      .post("api/send_custom_mail", {
                        data: {
                          isAllSelected: isAllSelected,
                          userId: userId,
                          subject: formData.subject,
                          body: formData.body,
                        },
                      })
                      .then((res) => {
                        setSendMail(false);
                        setIsAlertSuccessMsgLoaded(true);
                        setSuccessMsg("Mail Sent Successfully");
                      })
                      .catch((e) => {
                        setIsAlertDangerMsgLoaded(true);
                        setDangerMsg("Error in sending mail");
                        console.log(e);
                      });
                  }}
                >
                  <Modal.Header
                    style={{
                      backgroundColor: "#404040",
                      fontWeight: "300",
                      color: "white",
                      fontSize: "14px",
                      height: "100%",
                    }}
                    closeButton
                  >
                    {" "}
                    Send Message
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-3">
                      <Form.Control
                        style={{
                          fontsize: "12px",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                        }}
                        type="text"
                        required
                        name="subject"
                        onChange={handleChange}
                        placeholder="Subject"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        style={{ fontsize: "12px" }}
                        as="textarea"
                        placeholder="Body"
                        name="body"
                        onChange={handleChange}
                        rows={7}
                        required
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      style={{
                        marginBottom: "5px",
                        backgroundColor: "#1a73e8",
                        borderRadius: "5px",
                        border: "none",
                        fontSize: "12px",
                        width: "100px",
                        textAlign: "center",
                      }}
                      type="submit"
                    >
                      Send
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
              <ConfirmDialogBox
                showConfirmDialogBox={showConfirmDialogBox}
                setShowConfirmDialogBox={setShowConfirmDialogBox}
                confirm_no={confirm_no}
                confirm_yes={confirm_yes}
                arg={argConfirmModal}
                msg={"Are you sure you want to delete this student result?"}
                title={"Delete it?"}
              />
              <button
                style={{
                  marginLeft: "1%",
                  marginBottom: "5px",
                  backgroundColor: "#293E6F",
                  borderRadius: "5px",
                  border: "none",
                }}
                className="btn btn-secondary"
                onClick={(e) => navigate("/admin/scheduledTest")}
              >
                Back
              </button>
              <div
                style={{
                  padding: "20px 15px",
                  fontSize: "12px",
                  background: "#FFFFFF",
                  border: "2px solid #E5E5E5",
                  boxSizing: "border-box",
                  borderRadius: "14px",
                  marginBottom: "40px",
                  marginTop: "20px",
                }}
              >
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>Test Name: </Col>
                  <Col md={9}>
                    <input
                      type="string"
                      defaultValue={location.state.name}
                      disabled
                    ></input>
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>Start Time:</Col>
                  <Col md={9}>
                    <DateTimePicker disabled value={location.state.start} />
                  </Col>
                </Row>
                <Row style={{ margin: "2% 0" }}>
                  <Col md={3}>End Time:</Col>
                  <Col md={9}>
                    <DateTimePicker disabled value={location.state.end} />
                  </Col>
                </Row>
                <MDBDataTable
                  striped
                  bordered
                  noBottomColumns
                  hover
                  exportToCSV={true}
                  data={data}
                  style={{ marginTop: "5px" }}
                />
                <button
                  style={{
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
                  <CSVLink
                    style={{ textDecoration: "none", color: "#FFFF" }}
                    data={rows}
                    headers={headers}
                  >
                    <SiMicrosoftexcel style={{ marginRight: "10px" }} />{" "}
                    Download csv
                  </CSVLink>
                </button>

                <button
                  style={{
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    backgroundColor: "#10B65C",
                    fontFamily: "Poppins",
                    padding: "5px 45px",
                    color: "#FFFFFF",
                    margin: "0 0 0 40px",
                  }}
                  onClick={(e) => {
                    let x = $(".checkbox_send_mail:checkbox:checked");
                    if (x.length !== 0) {
                      setSendMail(true);
                    } else {
                      setIsAlertDangerMsgLoaded(true);
                      setDangerMsg("Please select atleast one student to send a mail");
                    }
                  }}
                >
                  <AiFillMail style={{ marginRight: "10px" }} />
                  Send Mail
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}

export default ViewSchdlTest;
