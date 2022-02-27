import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Row, Col, OverlayTrigger, Popover } from "react-bootstrap";
import { MDBDataTable, MDBInput } from "mdbreact";
import Alert from "../../components/Admin/Alert";
import Loader from "../../components/Loader";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function Feedback() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>Allow feedbacks from students.</Popover.Body>
    </Popover>
  );
  const [data, setTData] = useState({ columns: [], rows: [] });
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [areAllChecked, setAreAllChecked] = useState(false);
  const checkAllHandler = (val) => {
    let c = $(".checkboxFeedback:checkbox");
    c.prop("checked", val);
    setAreAllChecked(val);
  };

  function checkAllSelected(rowLength) {
    let c = $(".checkboxFeedback:checkbox:checked").length;
    let areAllSected = parseInt(c) === parseInt(rowLength);
    setAreAllChecked(areAllSected ? true : false);
    document.getElementById("selectAllCheckboc").checked = areAllSected
      ? true
      : false;
  }
  useEffect(() => {
    setIsloading(true);

    axiosInstance
      .get("api/feedback")
      .then((res) => {
        setIsloading(false);
        let rowArr = res.data.feedback_data.map((v, index) => ({
          ...v,
          checkBtn: (
            <MDBInput
              label=" "
              defaultChecked={areAllChecked ? true : v.checkBtn}
              type="checkbox"
              name="checkboxFeedback"
              className="checkboxFeedback"
              id={"checkbox" + v.userId}
              onChange={(e) => checkAllSelected(res.data.feedback_data.length)}
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
                defaultChecked={res.data.takeFeedback}
              />
            ),
            field: "checkBtn",
          },
          {
            label: "id",
            field: "userId",
          },
          {
            label: "Email",
            field: "email",
          },
          {
            label: "Rating",
            field: "rating",
          },
          {
            label: "Comment",
            field: "comment",
          },
        ];

        setTData({
          columns: columns,
          rows: rowArr,
        });
      })
      .catch((e) => {
        setIsloading(false);
        setIsAlertDangerMsgLoaded(true);
        setDangerMsg("Error Occured");
        console.log(e);
      });
  }, []);

  return (
    <div>
      {isDesktopOrLaptop?<>
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
        <div style={{ fontSize: "13.6px", padding: "0 60px" }}>
          <button
            onClick={() => {
              navigate("/admin/home");
            }}
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
            Take Feedbacks
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
                />
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
            noRecordsFoundLabel={"No Feedbacks"}
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
                type="button"
                onClick={(e) => {
                  let x = $(".checkboxFeedback:checkbox:checked");
                  let userId = [];
                  let isAllSelected = 0;
                  if (!areAllChecked && x.length !== 0) {
                    x.map((xx) =>
                      userId.push(parseInt(x[xx].id.split("checkbox")[1]))
                    );
                  } else {
                    if (!(x.length === 0)) {
                      isAllSelected = 1;
                    }
                  }
                  axiosInstance
                    .post("api/takeFeedback", {
                      data: { isAllSelected: isAllSelected, userId: userId },
                    })
                    .then((res) => {
                      window.location.reload();
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              >
                Take Feedbacks
              </button>
            </Col>
          </Row>
        </div>
      )}
</>:<MobileWidth/>}
          </div>
  );
}

export default Feedback;
