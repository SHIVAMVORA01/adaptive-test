import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomTimer from "../../screens/Admin/CustomTimer";

function TestHeaderComp({
  noTotal = false,
  timer,
  start,
  reset,
  totalKey,
  timeKey,
  totalValue,
  header,
  nextpage,
  setMd,
}) {
  return (
    <div id="testHeaderComp">
      <Row>
        <Col md="4" style={{ textAlign: "center", fontSize: "18px" }}>
          <div>{header}</div>
        </Col>
        {noTotal ? (
          <Col
            md={noTotal ? 8 : 6}
            style={{
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "right",
              fontSize: "18px",
            }}
          >
            {timeKey}:
            <CustomTimer
              style={{ fontSize: "18px" }}
              start={start}
              reset={reset}
              time={timer}
              nextpage={nextpage}
              setMd={setMd}
            ></CustomTimer>
          </Col>
        ) : (
          <Col
            md={noTotal ? 8 : 6}
            style={{
              whiteSpace: "nowrap",
              display: "inline-block",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            {timeKey}:
            <CustomTimer
              start={start}
              reset={reset}
              time={timer}
              nextpage={nextpage}
              setMd={setMd}
            ></CustomTimer>
          </Col>
        )}
        {!noTotal && (
          <Col md="2" style={{ textAlign: "center", fontSize: "18px" }}>
            {totalKey} : <b>{totalValue}</b>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default TestHeaderComp;
