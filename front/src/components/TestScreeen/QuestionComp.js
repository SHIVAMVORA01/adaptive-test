import React from "react";
import { Col, Row } from "react-bootstrap";
import crypt from "./crypt";
import TextAreaAutoSize from "./TextAreaAutoSize";
import { Image } from "cloudinary-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function QuestionComp({
  ans,
  question,
  isPersonality = false,
  options,
  level,
  qsno,
  qsimg,
  checkBoxToggle,
}) {
  return (
    <div id="quesComp" style={{ padding: "10px 20px" }}>
      {qsno <= ans.length && (
        <>
          {!isPersonality && (
            <Row>
              <Col>
                <div style={{ float: "right", fontWeight: "500" }}>
                  Difficulty Level :{" "}
                  {level === 2 ? "Medium" : level === 3 ? "Hard" : "Easy"}
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <div style={{ padding: "10px 0 20px 0", fontWeight: "600" }}>
                Question {qsno + 1}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {qsimg !== null && (
                <Image
                  cloudName="chaitanya1911"
                  publicId={qsimg}
                  width="500"
                  crop="scale"
                  alt="img"
                ></Image>
              )}
              <div className="TestQs">
                <TextAreaAutoSize
                  text={question}
                  checkBoxToggle={checkBoxToggle}
                  isQs={true}
                ></TextAreaAutoSize>
              </div>
            </Col>
          </Row>
          <div style={{ padding: "15px 0 10px 0" }}>
            {!isPersonality &&
              options.map((option, index) => {
                return (
                  <div
                    className="form-check"
                    style={{ margin: "10px 5px" }}
                    key={index}
                  >
                    <input
                      className="form-check-input qsRadio"
                      type="radio"
                      id={index}
                      name={question}
                      value={crypt.encryptVal(option.mrks)}
                      style={{}}
                    />

                    <TextAreaAutoSize
                      text={option.opt}
                      checkBoxToggle={checkBoxToggle}
                      optId={index}
                    ></TextAreaAutoSize>
                  </div>
                );
              })}
            {isPersonality && (
              <>
                <div
                  className="form-check"
                  style={{ padding: "5px 0", marginBottom: "10px" }}
                >
                  <input
                    type="radio"
                    id={"qsRadio1"}
                    name={question}
                    class="qsRadio"
                    value={1}
                    style={{ height: "13px" }}
                  />
                  <label
                    className="form-check-label textdivOpt"
                    for={"qsRadio1"}
                    style={{
                      width: "95%",
                      marginLeft: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Very Inaccurate
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{ padding: "5px 0", marginBottom: "10px" }}
                >
                  <input
                    type="radio"
                    id={"qsRadio2"}
                    name={question}
                    class="qsRadio"
                    value={2}
                    style={{ height: "13px" }}
                  />
                  <label
                    className="form-check-label textdivOpt"
                    for={"qsRadio2"}
                    style={{
                      width: "95%",
                      marginLeft: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Moderately Inaccurate
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{ padding: "5px 0", marginBottom: "10px" }}
                >
                  <input
                    type="radio"
                    id={"qsRadio3"}
                    name={question}
                    class="qsRadio"
                    value={3}
                    style={{ height: "13px" }}
                  />
                  <label
                    className="form-check-label textdivOpt"
                    for={"qsRadio3"}
                    style={{
                      width: "95%",
                      marginLeft: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Neither Accurate nor Inaccurate
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{ padding: "5px 0", marginBottom: "10px" }}
                >
                  <input
                    type="radio"
                    id={"qsRadio4"}
                    name={question}
                    class="qsRadio"
                    value={4}
                    style={{ height: "13px" }}
                  />
                  <label
                    className="form-check-label textdivOpt"
                    for={"qsRadio4"}
                    style={{
                      width: "95%",
                      marginLeft: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Moderately Accurate
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{ padding: "5px 0", marginBottom: "10px" }}
                >
                  <input
                    type="radio"
                    id={"qsRadio5"}
                    name={question}
                    class="qsRadio"
                    value={5}
                    style={{ height: "13px" }}
                  />
                  <label
                    className="form-check-label textdivOpt"
                    for={"qsRadio5"}
                    style={{
                      width: "95%",
                      marginLeft: "15px",
                      fontWeight: "400",
                    }}
                  >
                    Very Accurate
                  </label>
                </div>
              </>
            )}
            <button
              type="submit"
              style={{ color: "white" }}
              className="btn nextQsBtn"
            >
              Next Question
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionComp;
