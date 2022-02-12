import React from "react";
import TextareaAutosize from "react-textarea-autosize";

function TextAreaAutoSize({
  text,
  optId,
  checkBoxToggle = undefined,
  isQs = false,
  isCoding = false,
}) {
  return (
    <>
      {text !== "" && text !== undefined && (
        <TextareaAutosize
          className={
            isQs
              ? "form-check-label style-4 textdivQs"
              : "form-check-label style-4 textdivOpt"
          }
          onClick={(e) => {
            if (!isQs) {
              if (checkBoxToggle !== undefined) checkBoxToggle(e, optId);
            }
          }}
          readOnly
          style={{
            width: "100%",
            backgroundColor: isCoding ? "#F8F8F8" : "transparent",
            borderColor: isCoding ? "rgba(118, 118, 118, 0.3)" : "none",
            resize: "none",
            cursor: isQs ? "default" : "pointer",
            padding: "0px 0 0px 5px",
            color: "#293e6f",
            border: isCoding ? "1px ridge" : `0px`,
          }}
          value={text}
        />
      )}
    </>
  );
}

export default TextAreaAutoSize;
