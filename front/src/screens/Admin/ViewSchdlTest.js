import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import axiosInstance from "../../axios";
import { MDBDataTable } from "mdbreact";
import { CSVLink } from "react-csv";
import Loader from "../../components/Loader";
import { SiMicrosoftexcel } from "react-icons/si";
import ConfirmDialogBox from "../../components/ConfirmDialogBox";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function ViewSchdlTest() {
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
  // let addBtn;
  const columns = [
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
    {isDesktopOrLaptop?<>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
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
              fontSize: "13.6px",
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
                <SiMicrosoftexcel style={{ marginRight: "10px" }} /> Download
                csv
              </CSVLink>
            </button>
          </div>
        </div>
      )}
</>:<MobileWidth/>}
          </>
  );
}

export default ViewSchdlTest;
