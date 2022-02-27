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
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { AiFillMail } from "react-icons/ai";

function ViewSchdlTest() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });

  function checkAllSelected(rowLength) {
    let c = $(".checkboxFeedback:checkbox:checked").length;
    let areAllSected = parseInt(c) === parseInt(rowLength);
    document.getElementById("selectAllCheckboc").checked = areAllSected
      ? true
      : false;
  }

  const checkAllHandler = (val) => {
    let c = $(".checkboxFeedback:checkbox");
    c.prop("checked", val);
  };
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [data, setTData] = useState({ columns: [], rows: [] });
  const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
  const [argConfirmModal, setArgConfirmModal] = useState();
  const [sendMail, setSendMail] = useState(false);
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
          defaultChecked={false}
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
                name="checkboxFeedback"
                className="checkboxFeedback"
                id={"checkbox" + v.id}
                onChange={(e) => checkAllSelected(res.data.notallowed.length)}
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
  return (
    <>
      {isDesktopOrLaptop ? (
        <>
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <Modal
                show={sendMail}
                onHide={() => setSendMail(false)}
                aria-labelledby="send_mail"
                centered
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
                  <Form style={{ fontSize: "12px" }}>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        style={{
                          fontsize: "12px",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                        }}
                        type="text"
                        placeholder="To"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        style={{
                          fontsize: "12px",
                          borderTop: "none",
                          borderLeft: "none",
                          borderRight: "none",
                        }}
                        type="text"
                        placeholder="Subject"
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Control
                        style={{ fontsize: "12px", border: "none" }}
                        as="textarea"
                        rows={3}
                      />
                    </Form.Group>
                  </Form>
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
                  >
                    Send
                  </Button>
                </Modal.Footer>
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
                  onClick={(e) => setSendMail(true)}
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
