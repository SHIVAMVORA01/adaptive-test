import React from "react";
import { Col, Row } from "react-bootstrap";

function QuestionComp({
  ans,
  question,
  isPersonality = false,
  options,
  level,
  qsno,
}) {
  return (
    <div id="quesComp" style={{ padding: "10px 20px" }}>
      {qsno <= ans.length && (
        <>
          <Row>
            <Col>
              <div style={{ float: "right", fontWeight: "500" }}>
                Difficulty Level :{" "}
                {level === 2 ? "Medium" : level === 3 ? "Hard" : "Easy"}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ padding: "10px 0 20px 0", fontWeight: "600" }}>
                Question {qsno + 1}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ padding: "5px 0 20px 0px", fontWeight: "700" }}>
                {question}
              </div>
            </Col>
          </Row>
          <div style={{ padding: "15px 0 10px 0" }}>
            {!isPersonality &&
              options.map((option, index) => {
                return (
                  <p key={index} style={{ padding: "5px 0" }}>
                    <input
                      type="radio"
                      id={index}
                      name={question}
                      class="radio qsRadio"
                      value={option.mrks}
                      style={{ height: "13px" }}
                    />
                    <label
                      class="option"
                      id="option-one-label"
                      style={{ marginLeft: "15px", fontWeight: "400" }}
                    >
                      {option.opt}
                    </label>
                  </p>
                );
              })}
            {isPersonality && (
              <>
                <p key={1} style={{ padding: "5px 0" }}>
                  <input
                    type="radio"
                    id={1}
                    name={question}
                    class="radio qsRadio"
                    value={1}
                    style={{ height: "13px" }}
                  />
                  <label
                    class="option"
                    id="option-one-label"
                    style={{ marginLeft: "15px", fontWeight: "400" }}
                  >
                    Very Inaccurate
                  </label>
                </p>
                <p key={2} style={{ padding: "5px 0" }}>
                  <input
                    type="radio"
                    id={2}
                    name={question}
                    class="radio qsRadio"
                    value={2}
                    style={{ height: "13px" }}
                  />
                  <label
                    class="option"
                    id="option-one-label"
                    style={{ marginLeft: "15px", fontWeight: "400" }}
                  >
                    Moderately Inaccurate
                  </label>
                </p>
                <p key={3} style={{ padding: "5px 0" }}>
                  <input
                    type="radio"
                    id={3}
                    name={question}
                    class="radio qsRadio"
                    value={3}
                    style={{ height: "13px" }}
                  />
                  <label
                    class="option"
                    id="option-one-label"
                    style={{ marginLeft: "15px", fontWeight: "400" }}
                  >
                    Neither Accurate Nor Inaccurate
                  </label>
                </p>
                <p key={4} style={{ padding: "5px 0" }}>
                  <input
                    type="radio"
                    id={4}
                    name={question}
                    class="radio qsRadio"
                    value={4}
                    style={{ height: "13px" }}
                  />
                  <label
                    class="option"
                    id="option-one-label"
                    style={{ marginLeft: "15px", fontWeight: "400" }}
                  >
                    Moderately Accurate
                  </label>
                </p>
                <p key={5} style={{ padding: "5px 0" }}>
                  <input
                    type="radio"
                    id={5}
                    name={question}
                    class="radio qsRadio"
                    value={5}
                    style={{ height: "13px" }}
                  />
                  <label
                    class="option"
                    id="option-one-label"
                    style={{ marginLeft: "15px", fontWeight: "400" }}
                  >
                    Very Accurate
                  </label>
                </p>
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
