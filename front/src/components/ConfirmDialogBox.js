import React from "react";
import { Modal, Button } from "react-bootstrap";
import { GoAlert } from "react-icons/go";

function ConfirmDialogBox({
  showConfirmDialogBox,
  setShowConfirmDialogBox,
  confirm_no,
  confirm_yes,
  arg,
  msg,
  title,
  onlyOk = false,
}) {
  function confirmYes(e) {
    confirm_yes(arg);
    setShowConfirmDialogBox(false);
  }
  function confirmNo(e) {
    confirm_no();
    setShowConfirmDialogBox(false);
  }
  return (
    <Modal
      show={showConfirmDialogBox}
      backdrop="static"
      keyboard={false}
      style={{}}
      centered
    >
      <Modal.Body
        style={{ textAlign: "center", padding: "20px 20px 15px 20px" }}
      >
        <p style={{ textAlign: "center", fontSize: "20px" }}>
          <b>{title}</b>
        </p>
        <div
          style={{ textAlign: "center", color: "#627D98", fontSize: "13.6px" }}
        >
          {msg}
        </div>
        {!onlyOk && (
          <div
            style={{
              background: "#FFE9D9",
              boxSizing: "border-box",
              borderRadius: "4px",
              width: "400px",
              height: "70px",
              borderLeft: "4px solid #EF7D52",
              paddingRight: "50px",
              marginLeft: "30px",
              marginTop: "10px",
            }}
          >
            <GoAlert
              style={{
                height: "35px",
                width: "15px",
                color: "#F25929",
                marginLeft: "15px",
                marginTop: "15px",
              }}
            />
            <p
              style={{
                marginTop: "-35px",
                marginLeft: "45px",
                color: "#82221A",
                fontSize: "14px",
              }}
            >
              Warning
            </p>
            <p
              style={{
                marginTop: "-15px",
                marginLeft: "45px",
                color: "#D24A2D",
                fontSize: "12px",
              }}
            >
              You cannot undo your action{" "}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ borderTop: "none" }}>
        {!onlyOk && (
          <>
            <Button
              style={{
                backgroundColor: "#627D98",
                width: "80px",
                outline: "none",
                border: "none",
                fontSize: "12px",
              }}
              onClick={confirmNo}
            >
              No
            </Button>
            <Button
              style={{
                backgroundColor: "#E42B38",
                width: "80px",
                marginRight: "40px",
                outline: "none",
                border: "none",
                fontSize: "12px",
              }}
              onClick={confirmYes}
            >
              Yes
            </Button>
          </>
        )}
        {onlyOk && (
          <>
            <Button
              style={{
                backgroundColor: "#E42B38",
                width: "80px",
                marginRight: "auto",
                marginLeft: "auto",
                outline: "none",
                border: "none",
                fontSize: "12px",
              }}
              onClick={confirmYes}
            >
              Okay
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDialogBox;
