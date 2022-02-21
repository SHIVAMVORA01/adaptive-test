import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { MDBDataTable, MDBInput } from "mdbreact";
import Alert from "../../components/Admin/Alert";
import Loader from "../../components/Loader";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

function Feedback() {
  const [data, setTData] = useState({ columns: [], rows: [] });
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertMsgLoaded, setIsAlertMsgLoaded] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [areAllChecked, setAreAllChecked] = useState(false);
  const checkAllHandler = (val) => {
    let c = $(".checkboxFeedback:checkbox");
    c.prop("checked", val);
    setAreAllChecked(val);
  };

  function checkAllSelected(rowLength) {
    let c = $(".checkboxFeedback:checkbox:checked").length;
    console.log(rowLength);
    console.log(c);
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
        console.log(res.data);
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
        setIsAlertMsgLoaded(true);
        setDangerMsg("Error Occured");
        console.log(e);
      });
  }, []);

  return (
    <div>
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
        <div style={{ fontSize: "13.6px" }}>
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
            noRecordsFoundLabel={"No Feedbacks"}
            style={{ marginTop: "40px", fontSize: "13.6px" }}
          />
          <button
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
              marginLeft: "560px",
            }}
            type="button"
            onClick={(e) => {
              let x = $(".checkboxFeedback:checkbox:checked");
              let arrIdFeedback = [];
              let userId = [];
              let isAllSelected = 0;
              if (!areAllChecked && x.length !== 0) {
                x.map((xx) =>
                  userId.push(parseInt(x[xx].id.split("checkbox")[1]))
                );

                console.log(userId);
              } else {
                console.log("all select");
                if (!(x.length === 0)) {
                  isAllSelected = 1;
                }
              }
              axiosInstance
                .post("api/takeFeedback", {
                  data: { isAllSelected: isAllSelected, userId: userId },
                })
                .then((res) => {
                  console.log(res.data);
                  window.location.reload();
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Take Feedbacks
          </button>
        </div>
      )}
    </div>
  );
}

export default Feedback;
