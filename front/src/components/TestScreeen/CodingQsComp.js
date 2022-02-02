import React from "react";

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
          <textarea
            defaultValue={qs.question}
            style={{ height: "max-content", width: "100%" }}
            rows={6}
            className="style-4"
            disabled
          ></textarea>
          <h5>
            <b>Input Format</b>
          </h5>

          <textarea
            defaultValue={qs.input_format}
            style={{ height: "max-content", width: "100%" }}
            rows={3}
            className="style-4"
            disabled
          ></textarea>
          <h5>
            <b>Output Format</b>
          </h5>

          <textarea
            defaultValue={qs.output_format}
            style={{ height: "max-content", width: "100%" }}
            rows={3}
            className="style-4"
            disabled
          ></textarea>
          <h5>
            <b>Constraints</b>
          </h5>

          <textarea
            defaultValue={qs.constraints}
            style={{ height: "max-content", width: "100%" }}
            className="style-4"
            disabled
          ></textarea>
          <h5>
            <b>Sample Input 1 </b>
          </h5>
          <textarea
            defaultValue={qs.sample_input}
            style={{ height: "fit-content" }}
            className="style-4"
            disabled
          ></textarea>
          <h5>
            <b>Sample Output 1 </b>
          </h5>
          <textarea
            defaultValue={qs.sample_output}
            style={{ height: "fit-content" }}
            disabled
            className="style-4"
          ></textarea>
          {qs.explanation !== null && qs.explanation !== "" && (
            <h5>
              <b>Explanation</b>
            </h5>
          )}
          {qs.explanation !== null && qs.explanation !== "" && (
            <textarea
              defaultValue={qs.explanation}
              className="style-4"
              rows={3}
              style={{ height: "fit-content", width: "100%" }}
              disabled
            ></textarea>
          )}
        </>
      )}
    </div>
  );
}

export default CodingQsComp;
