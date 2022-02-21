import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MDBDataTable, MDBInput } from "mdbreact";
import Alert from "../../components/Admin/Alert";
import Loader from "../../components/Loader";
import $ from "jquery";
import "../../css/Permissions.css";

function Permissions() {
  const navigate = useNavigate();
  const [data, setTData] = useState({ columns: [], rows: [] });
  const [allowed, setAllowed] = useState([]);
  const [data2, setTData2] = useState({ columns: [], rows: [] });
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertMsgLoaded, setIsAlertMsgLoaded] = useState(false);
  const [isLoading, setIsloading] = useState(true);

  function checkAllSelected(rowLength) {
    let c = $(".checkboxFeedback:checkbox:checked").length;
    console.log(rowLength);
    console.log(c);
    let areAllSected = parseInt(c) === parseInt(rowLength);
    document.getElementById("selectAllCheckboc").checked = areAllSected
      ? true
      : false;
  }

  const checkAllHandler = (val) => {
    let c = $(".checkboxFeedback:checkbox");
    c.prop("checked", val);
  };
  const columns2 = [
    {
      label: "id",
      field: "id",
    },
    {
      label: "Email",
      field: "email",
    },
    {
      label: "Name",
      field: "first_name",
    },
  ];

  useEffect(() => {
    const data = async () =>
      await axiosInstance
        .get("api/getuserslist")
        .then((res) => {
          if (res.data.exists) {
            setAllowed(res.data.allowed);
            let rowArr = res.data.notallowed.map((v) => ({
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
            }));

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
                label: "id",
                field: "id",
              },
              {
                label: "Email",
                field: "email",
              },
              {
                label: "Name",
                field: "first_name",
              },
            ];
            setTData({
              columns: columns,
              rows: rowArr,
            });

            setTData2({
              columns: columns2,
              rows: res.data.allowed,
            });
          } else {
            alert("There is no ongoing test");
            navigate("/admin/home");
          }
        })
        .catch((e) => console.log(e));
    data();
    setIsloading(false);
  }, []);

  return (
    <>
      <Alert
        msg={successMsg}
        setIsAlertMsgLoaded={setIsAlertMsgLoaded}
        isAlertMsgLoaded={isAlertMsgLoaded}
        type="success"
      ></Alert>
      <Alert
        msg={dangerMsg}
        setIsAlertMsgLoaded={setIsAlertMsgLoaded}
        isAlertMsgLoaded={isAlertMsgLoaded}
        type="danger"
      ></Alert>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div style={{ fontSize: "13.6px" }}>
            <Row>
              <Col>
                <button
                  onClick={() => { navigate("/admin/home") }}
                  type="button"
                  style={{
                    marginTop: "10px",
                    marginBottom: "30px",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    backgroundColor: "#293e6f",
                    fontFamily: "Poppins",
                    padding: "5px 45px",
                    color: "#FFFFFF",
                    marginLeft: "5px",
                  }}
                >
                  Back
                </button>
                <p style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "0px",
                  marginTop: "10px",
                  color: "#293e6f",
                  textAlign: "center",

                }}>Grant Permissions</p>
                <p className="AdWell" style={{
                  fontFamily: "Poppins",
                  color: "#999999",
                  fontWeight: "100",
                  marginTop: "30px",
                  fontSize: "15.4px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  marginBottom: "40px",
                  textAlign: "center",
                }}> Permission must be granted for students to take their tests. From the tables below, choose the students to whom you want to grant permission.</p>

                <MDBDataTable
                  className="feedbackTable"
                  striped
                  bordered
                  noBottomColumns
                  hover
                  exportToCSV={true}
                  data={data}
                  noRecordsFoundLabel={"Allowed to All"}
                  style={{ marginTop: "40px" }}
                />
                <button
                  type="button"
                  style={{
                    marginTop: "10px",
                    marginBottom: "30px",
                    border: "none",
                    outline: "none",
                    borderRadius: "5px",
                    fontWeight: "normal",
                    backgroundColor: "#10B65C",
                    fontFamily: "Poppins",
                    padding: "5px 45px",
                    color: "#FFFFFF",
                    marginLeft: "550px",

                  }}
                  onClick={(e) => {
                    setIsloading(true);
                    let x = $(".checkboxFeedback:checkbox:checked");
                    let arrIdFeedback = [];
                    let userId = [];
                    let isAllSelected = 0;
                    x.map((xx) =>
                      userId.push(parseInt(x[xx].id.split("checkbox")[1]))
                    );
                    console.log(userId);
                    if (userId.length === 0) {
                      setIsloading(false);
                      setIsAlertMsgLoaded(true);
                      setDangerMsg("select users to grant permission");
                    } else {
                      axiosInstance
                        .post("api/permission", {
                          data: { users: userId },
                        })
                        .then((res) => {
                          setIsloading(false);
                          if (res.data.exists) {
                            window.location.reload();
                          } else {
                            setIsAlertMsgLoaded(true);
                            setDangerMsg("Error Occured");
                          }
                        })
                        .catch((e) => {
                          console.log(e);
                          setIsloading(false);
                        });
                    }
                  }}
                >
                  Grant Permission
                </button>
              </Col>
              <Row>
                <Col>
                  <MDBDataTable
                    className="feedbackTable2"
                    striped
                    bordered
                    noBottomColumns
                    hover
                    exportToCSV={true}
                    data={data2}
                    noRecordsFoundLabel={"No Permissions given"}
                    style={{ marginTop: "20px" , marginBottom:"30px"}}
                  />
                </Col>
              </Row>
            </Row>
          </div>
        </>
      )}
    </>
  );
}
export default Permissions;
