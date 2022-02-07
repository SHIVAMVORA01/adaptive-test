import React from "react";
import TextAreaAutoSize from "./TextAreaAutoSize";

function CodingQsComp({ qs }) {
  return (
    <div
      className="scrollbar"
      id="style-4"
      style={{
        backgroundColor: "white",
        height: window.screen.height - 300,
        padding: "5px 10px",
      }}
    >
      {qs !== undefined && (
        <>
          <TextAreaAutoSize
            text={qs.question}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>
          <h6>
            <b>Input Format</b>
          </h6>

          <TextAreaAutoSize
            text={qs.input_format}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>
          <h6>
            <b>Output Format</b>
          </h6>

          <TextAreaAutoSize
            text={qs.output_format}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>
          <h6>
            <b>Constraints</b>
          </h6>

          <TextAreaAutoSize
            text={qs.constraints}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>

          <h6>
            <b>Sample Input 1 </b>
          </h6>

          <TextAreaAutoSize
            text={qs.sample_input}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>

          <h6>
            <b>Sample Output 1 </b>
          </h6>

          <TextAreaAutoSize
            text={qs.sample_output}
            isQs={true}
            isCoding={true}
          ></TextAreaAutoSize>
          {qs.explanation !== null && qs.explanation !== "" && (
            <h6>
              <b>Explanation</b>
            </h6>
          )}
          {qs.explanation !== null && qs.explanation !== "" && (
            <TextAreaAutoSize
              text={qs.explanation}
              isQs={true}
              isCoding={true}
            ></TextAreaAutoSize>
          )}
        </>
      )}
    </div>
  );
}

export default CodingQsComp;
