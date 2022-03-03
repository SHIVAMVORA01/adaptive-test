import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import {
  Form,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MDBDataTable, MDBInput } from "mdbreact";
import Alert from "../../components/Admin/Alert";
import Loader from "../../components/Loader";
import $ from "jquery";
import "../../css/Permissions.css";
import { FiInfo } from "react-icons/fi";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import ConfirmDialogBox from "../../components/ConfirmDialogBox";

function Permissions() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        Permission must be granted for students to take their tests.From the
        tables below, choose the students to whom you want to grant permission.
      </Popover.Body>
    </Popover>
  );
  const navigate = useNavigate();
  const [data, setTData] = useState({ columns: [], rows: [] });
  const [allowed, setAllowed] = useState([]);
  const [data2, setTData2] = useState({ columns: [], rows: [] });
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
  const [argConfirmModal, setArgConfirmModal] = useState();
  const [confirm_yes_func, set_confirm_yes_func] = useState();
  const [confirm_no_func, set_confirm_no_func] = useState();
  const [confirm_dialog_msg, set_confirm_dialog_msg] = useState("");

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
            set_confirm_yes_func(() => onYes);
            set_confirm_no_func(() => {});
            set_confirm_dialog_msg("There are no ongoing tests");
            setShowConfirmDialogBox(true);
          }
        })
        .catch((e) => console.log(e));
    data();
    setIsloading(false);
  }, []);
  function onYes() {
    navigate("/admin/home");
  }

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
            <>
              <div
                style={{
                  fontSize: "13.6px",
                  padding: "0 60px",
                  marginBottom: "20px",
                }}
                className="main_permission_div"
              >
                <ConfirmDialogBox
                  showConfirmDialogBox={showConfirmDialogBox}
                  setShowConfirmDialogBox={setShowConfirmDialogBox}
                  title={"No Ongoing tests"}
                  confirm_no={confirm_no_func}
                  confirm_yes={confirm_yes_func}
                  arg={argConfirmModal}
                  msg={confirm_dialog_msg}
                  onlyOk={true}
                />
                <Row>
                  <Col md={12}>
                    <button
                      onClick={() => {
                        navigate("/admin/home");
                      }}
                      type="button"
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
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
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        marginTop: "10px",
                        color: "#293e6f",
                        textAlign: "center",
                      }}
                    >
                      Grant Permissions
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
                            marginLeft: "5px",
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
                          ></FiInfo>
                        </button>
                      </OverlayTrigger>
                    </p>
                    <MDBDataTable
                      className="feedbackTable"
                      striped
                      bordered
                      noBottomColumns
                      hover
                      exportToCSV={true}
                      data={data}
                      noRecordsFoundLabel={"Allowed to All"}
                      style={{ marginTop: "5px", fontSize: "13.6px" }}
                    />
                    <Row>
                      <Col md={5} style={{ textAlign: "center" }}></Col>
                      <Col md={7}>
                        <button
                          style={{
                            margin: "10px auto 30px auto",
                            border: "none",
                            outline: "none",
                            borderRadius: "5px",
                            fontWeight: "normal",
                            backgroundColor: "#10B65C",
                            fontFamily: "Poppins",
                            padding: "5px 0px",
                            color: "#FFFFFF",
                            width: "165px",
                            textAlign: "center",
                          }}
                          onClick={(e) => {
                            setIsloading(true);
                            let x = $(".checkboxFeedback:checkbox:checked");
                            let userId = [];
                            x.map((xx) =>
                              userId.push(
                                parseInt(x[xx].id.split("checkbox")[1])
                              )
                            );
                            if (userId.length === 0) {
                              setIsloading(false);
                              setIsAlertDangerMsgLoaded(true);
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
                                    setIsAlertSuccessMsgLoaded(true);
                                    setSuccessMsg("Mail sent successfully");
                                  } else {
                                    setIsAlertDangerMsgLoaded(true);
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
                    </Row>
                  </Col>

                  <Col md={12}>
                    <MDBDataTable
                      className="feedbackTable2"
                      striped
                      bordered
                      noBottomColumns
                      hover
                      exportToCSV={true}
                      data={data2}
                      noRecordsFoundLabel={"No Permissions given"}
                      style={{ marginTop: "5px", fontSize: "13.6px" }}
                    />
                  </Col>
                </Row>
              </div>
            </>
          )}
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}
export default Permissions;
