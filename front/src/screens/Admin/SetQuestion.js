import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import "../../css/AdminAddQsScreen.css";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axios";
import $ from "jquery";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import AnalyticalQsComp from "../../components/Admin/AnalyticalQsComp";
import Alert from "../../components/Admin/Alert";
import { Image } from "cloudinary-react";
import ConfirmDialogBox from "../../components/ConfirmDialogBox";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";

function SetQuestion() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [navArray, setNavArray] = useState([]);
  const [countOpt, setCountOpt] = useState(2);
  const [currentQsNo, setCurrentQsNo] = useState(1);
  const [currentQsID, setCurrentQsID] = useState(-1);
  const [currentQs, setCurrentQs] = useState("");
  const [opt, setOpt] = useState([]);
  const [rerenderState, set_rerenderState] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.screen.height);
  const [isCoding, setIsCoding] = useState(false);
  const [isAnalytical, setIsAnalytical] = useState(false);
  const [inputF, setInputF] = useState();
  const [outputF, setOutputF] = useState();
  const [constraints, setConstraints] = useState();
  const [sampleInput, setSampleInput] = useState();
  const [sampleOutput, setSampleOutput] = useState();
  const [explanation, setExplanation] = useState();
  const [testCaseInput1, setTestCaseInput1] = useState();
  const [testCaseInput2, setTestCaseInput2] = useState();
  const [testCaseInput3, setTestCaseInput3] = useState();
  const [testCaseOutput1, setTestCaseOutput1] = useState();
  const [testCaseOutput2, setTestCaseOutput2] = useState();
  const [testCaseOutput3, setTestCaseOutput3] = useState();
  const [para_title, set_para_title] = useState();
  const [para, set_para] = useState();
  const [para_qs, set_para_qs] = useState([]);
  const [isPersonality, set_isPersonality] = useState(false);
  const [fileInputState, setFileInputState] = useState();
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [imgDB, setImgDb] = useState("");
  const [delImage, setDelImage] = useState(false);
  const [showConfirmDialogBox, setShowConfirmDialogBox] = useState(false);
  const [argConfirmModal, setArgConfirmModal] = useState();
  const [confirm_yes_func, set_confirm_yes_func] = useState();
  const [confirm_no_func, set_confirm_no_func] = useState();
  const [confirm_dialog_msg, set_confirm_dialog_msg] = useState("");
  const [confirm_dialog_title, set_confirm_dialog_title] = useState("");

  useEffect(() => {
    document.getElementById(location.state.type).selected = "selected";
    var divHeight = document.querySelector("#SETQS").clientHeight;
    setWindowHeight(divHeight);
    localStorage.removeItem("isNewTestReload");
    var temp = location.state.navArr;
    setNavArray(temp);
    if (parseInt(location.state.sid) === 5) {
      setIsCoding(true);
    } else if (parseInt(location.state.sid) === 6) {
      setIsAnalytical(true);
    } else if (parseInt(location.state.sid) === 4) {
      set_isPersonality(true);
    }
    if (temp[0] !== undefined) {
      if (location.state.sid !== 5 && location.state.sid !== 6) {
        setCurrentQsID(temp[0].id);
        setCurrentQs(temp[0].ques);
        setOpt(temp[0].options);
        setImgDb(temp[0].imgId);
      } else if (location.state.sid === 5) {
        setCurrentQsID(temp[0].id);
        setCurrentQs(temp[0].question || "");
        setOpt([]);
        setIsCoding(true);

        setInputF(temp[0].input_format || "");
        setOutputF(temp[0].output_format || "");
        setConstraints(temp[0].constraints || "");
        setSampleInput(temp[0].sample_input || "");
        setSampleOutput(temp[0].sample_output || "");
        setExplanation(temp[0].explanation || "");
        if (temp[0].test_case_input[0] && temp[0].test_case_output[0]) {
          setTestCaseInput1(temp[0].test_case_input[0] || "");
          setTestCaseOutput1(temp[0].test_case_output[0] || "");
        }
        if (temp[0].test_case_input[1] && temp[0].test_case_output[1]) {
          setTestCaseInput2(temp[0].test_case_input[1] || "");
          setTestCaseOutput2(temp[0].test_case_output[1] || "");
        }
        if (temp[0].test_case_input[2] && temp[0].test_case_output[2]) {
          setTestCaseInput3(temp[0].test_case_input[2] || "");
          setTestCaseOutput3(temp[0].test_case_output[2] || "");
        }
      } else if (location.state.sid === 6) {
        setCurrentQsID(temp[0].paraId);
        set_para_title(temp[0].title);
        set_para(temp[0].para);
        set_para_qs(temp[0].questions);
      }
    } else {
      setIsUpdate(true);
    }
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    var dictionary = {};
    if (parseInt(location.state.sid) === 6) {
      dictionary["paraId"] = currentQsID;
      let txtAreaEle = $("textarea");
      dictionary["rightOptArrAnalytical"] = {};
      dictionary["qsDict"] = {};
      for (let y = 0; y < txtAreaEle.length; y++) {
        if (txtAreaEle[y].name.includes("Qs")) {
          let a = {};
          dictionary[txtAreaEle[y].name] = txtAreaEle[y].value;
          dictionary["rightOptArrAnalytical"][txtAreaEle[y].name] = "";
          a["title"] = txtAreaEle[y].value;
          a["options"] = [];
          dictionary["qsDict"][txtAreaEle[y].name] = a;
        } else {
          dictionary[txtAreaEle[y].name] = txtAreaEle[y].value;
        }
      }
      let rightOptArr = $('input[name$="correctOpt"]:checked');

      for (let x = 0; x < rightOptArr.length; x++) {
        if (rightOptArr[x] !== null) {
          dictionary["rightOptArrAnalytical"][
            rightOptArr[x].value.split("Option")[0]
          ] = rightOptArr[x].value;
        }
      }
    } else {
      dictionary[document.getElementById("qsSetQs").name] =
        document.getElementById("qsSetQs").value;

      if (parseInt(location.state.sid) === 5) {
        dictionary[document.getElementById("qsSetInputFormat").name] =
          document.getElementById("qsSetInputFormat").value;
        dictionary[document.getElementById("qsSetOutputFormat").name] =
          document.getElementById("qsSetOutputFormat").value;
        dictionary[document.getElementById("qsSetConstraints").name] =
          document.getElementById("qsSetConstraints").value;
        dictionary[document.getElementById("qsSetSampleInput").name] =
          document.getElementById("qsSetSampleInput").value;
        dictionary[document.getElementById("qsSetSampleOutput").name] =
          document.getElementById("qsSetSampleOutput").value;
        dictionary[document.getElementById("qsSetExplanation").name] =
          document.getElementById("qsSetExplanation").value || "";

        dictionary[document.getElementById("qsSetTestCase1Input").name] =
          document.getElementById("qsSetTestCase1Input").value;
        dictionary[document.getElementById("qsSetTestCase1Output").name] =
          document.getElementById("qsSetTestCase1Output").value;
        dictionary[document.getElementById("qsSetTestCase2Input").name] =
          document.getElementById("qsSetTestCase2Input").value;
        dictionary[document.getElementById("qsSetTestCase2Output").name] =
          document.getElementById("qsSetTestCase2Output").value;
        dictionary[document.getElementById("qsSetTestCase3Input").name] =
          document.getElementById("qsSetTestCase3Input").value;
        dictionary[document.getElementById("qsSetTestCase3Output").name] =
          document.getElementById("qsSetTestCase3Output").value;
      }

      var rightOpt = document.querySelector('input[name="correctOpt"]:checked');

      if (rightOpt !== null) {
        dictionary["rightOpt"] = rightOpt.value;
      }
    }
    for (var x = 0; x < e.target.length; x++) {
      if (
        e.target[x] instanceof HTMLInputElement ||
        e.target[x] instanceof HTMLSelectElement
      ) {
        if (e.target[x].name.toString() !== "type") {
          if (isAnalytical) {
            var key = e.target[x].name.split("Option")[0].toString();
            if (key in dictionary["qsDict"]) {
              dictionary["qsDict"][key].options.push(e.target[x].name);
            }
          }
          dictionary[e.target[x].name] = e.target[x].value;
        } else {
          if (e.target[x].value == "Easy") {
            dictionary["type"] = 1;
          } else if (e.target[x].value == "Medium") {
            dictionary["type"] = 2;
          } else {
            dictionary["type"] = 3;
          }
        }
      }
    }
    if (parseInt(location.state.sid) === 4) {
      dictionary["type"] = 2;
    }
    dictionary["image"] = null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        uploadImage(reader.result, dictionary);
      };
      reader.onerror = () => {
        console.error("AHHHHHHHH!!");
        setIsAlertDangerMsgLoaded(true);
        setDangerMsg("something went wrong!");
      };
    } else if (delImage) {
      uploadImage("", dictionary);
    } else {
      uploadImage(null, dictionary);
    }
  }
  const uploadImage = async (base64EncodedImagee, dictionary) => {
    try {
      if (base64EncodedImagee !== null) {
        dictionary["image"] = base64EncodedImagee;
      }
      axiosInstance
        .post("api/admin/addQs", { data: dictionary })
        .then((res) => {
          navigate("/admin/newTest", {
            state: { sid: location.state.sid - 1 },
          });
        })
        .catch((e) => {
          console.log(e);
          setIsAlertDangerMsgLoaded(true);
          setDangerMsg("something went wrong!,Try Again");
        });
    } catch (e) {}
  };
  function delOptInSubQs(e, pId, qsId, questionIndex) {
    para_qs[questionIndex].options.pop();
    set_rerenderState(true);
  }
  function addOptInSubQs(e, pId, qsId, questionIndex) {
    para_qs[questionIndex].options.push({
      title: "New Opt",
      id: -1,
      paraqs: qsId,
    });
    set_rerenderState(true);
  }
  function delOpt(e) {
    setOpt(
      opt.filter(function (item, index) {
        return opt.length !== index + 1;
      })
    );
  }
  function delParaQs(e) {
    para_qs.pop();
    set_rerenderState(true);
  }
  function addOpt(e) {
    setCountOpt(countOpt + 1);
    setOpt(function (oldArray) {
      if (oldArray !== undefined) {
        return [
          ...oldArray,
          <p style={{ padding: "5px 0", margin: "10px 0px" }}>
            <div className="form-check">
              <input
                type="radio"
                name="correctOpt"
                disabled={!isUpdate}
                className="setQsRadio"
                value={`Option${countOpt + 1}`}
                id={`flexCheckDefault${countOpt + 1}`}
                required
              />
              <label
                className="form-check-label"
                style={{ marginLeft: "15px", fontWeight: "400", width: "96%" }}
                for={`flexCheckDefault${countOpt + 1}`}
              >
                <input
                  type="text"
                  className="form-control"
                  disabled={!isUpdate}
                  name={`Option${countOpt + 1}`}
                  placeholder={`Enter Option ${countOpt + 1}`}
                  id={`Option${countOpt + 1}`}
                  required
                />
              </label>
            </div>
          </p>,
        ];
      } else {
        return [
          <p style={{ padding: "5px 0", margin: "10px 0px" }}>
            <div className="form-check">
              <input
                type="radio"
                name="correctOpt"
                disabled={!isUpdate}
                className="setQsRadio"
                value={`Option${countOpt + 1}`}
                id={`flexCheckDefault${countOpt + 1}`}
                required
              />
              <label
                className="form-check-label"
                style={{ marginLeft: "15px", fontWeight: "400", width: "96%" }}
                for={`flexCheckDefault${countOpt + 1}`}
              >
                <input
                  type="text"
                  className="form-control"
                  disabled={!isUpdate}
                  name={`Option${countOpt + 1}`}
                  placeholder={`Enter Option ${countOpt + 1}`}
                  id={`Option${countOpt + 1}`}
                  required
                />
              </label>
            </div>
          </p>,
        ];
      }
    });
  }
  function addParaQs(e) {
    let noElementInDiv = $(`.qsArr > div`).length + 1 || 1;
    para_qs.push({
      question: "New Question",
      paraQsId: noElementInDiv,
      options: [],
    });
    set_rerenderState(true);
  }
  function confirm_del_yes() {
    var $boxes = $("input[name=styleCheckBox]:checked");

    var a = [];
    $boxes.each(function (item) {
      // Do stuff here with this
      var val = $boxes[item].value;
      val = val.split("CheckBox")[1];
      a.push(parseInt(val));
    });
    console.log(a);
    axiosInstance
      .post("api/admin/delQs", {
        data: { delQs: a, sid: location.state.sid },
      })
      .then((res) => {
        navigate("/admin/newTest", {
          state: { sid: location.state.sid - 1 },
        });
      });
  }
  function delQuestion(e) {
    var elCheckBox = document.getElementsByClassName("styled-checkbox");
    var $boxes = $("input[name=styleCheckBox]:checked");

    if (elCheckBox[0].style.display !== "none") {
      if ($boxes.length === 0) {
        for (var x = 0; x < elCheckBox.length; x++) {
          elCheckBox[x].style.display = "none";
        }
      } else {
        set_confirm_yes_func(() => confirm_del_yes);
        set_confirm_no_func(() => confirm_no);
        set_confirm_dialog_msg(
          "Are you sure you want to delete this question?"
        );
        set_confirm_dialog_title("Delete it?");
        setShowConfirmDialogBox(true);
      }
    } else {
      for (var x = 0; x < elCheckBox.length; x++) {
        elCheckBox[x].style.display = "inline-block";
      }
    }
  }
  function fillData(e) {
    document.getElementById("sbForm").reset();
    if (e.target.id.toString() !== "questionNew") {
      if (location.state.sid !== 5 && location.state.sid !== 6) {
        setCurrentQs(navArray[e.target.id].ques);
        setCurrentQsID(navArray[e.target.id].id);
        setOpt(navArray[e.target.id].options);
        setImgDb(navArray[e.target.id].imgId);
        setCurrentQsNo(`${parseInt(e.target.id) + 1}`);
      } else if (location.state.sid === 5) {
        setCurrentQsID(navArray[e.target.id].id);
        setCurrentQs(navArray[e.target.id].question);
        setOpt([]);
        setCurrentQsNo(`${parseInt(e.target.id) + 1}`);

        setInputF(navArray[e.target.id].input_format || "");
        setOutputF(navArray[e.target.id].output_format || "");
        setConstraints(navArray[e.target.id].constraints || "");
        setSampleInput(navArray[e.target.id].sample_input || "");
        setSampleOutput(navArray[e.target.id].sample_output || "");
        setExplanation(navArray[e.target.id].explanation || "");
        if (
          navArray[e.target.id].test_case_input !== null &&
          navArray[e.target.id].test_case_output !== null
        ) {
          if (
            navArray[e.target.id].test_case_input[0] &&
            navArray[e.target.id].test_case_output[0]
          ) {
            setTestCaseInput1(navArray[e.target.id].test_case_input[0] || "");
            setTestCaseOutput1(navArray[e.target.id].test_case_output[0] || "");
          }
          if (
            navArray[e.target.id].test_case_input[1] &&
            navArray[e.target.id].test_case_output[1]
          ) {
            setTestCaseInput2(navArray[e.target.id].test_case_input[1] || "");
            setTestCaseOutput2(navArray[e.target.id].test_case_output[1] || "");
          }
          if (
            navArray[e.target.id].test_case_input[2] &&
            navArray[e.target.id].test_case_output[2]
          ) {
            setTestCaseInput3(navArray[e.target.id].test_case_input[2] || "");
            setTestCaseOutput3(navArray[e.target.id].test_case_output[2] || "");
          }
        } else {
          setTestCaseInput1("");
          setTestCaseOutput1("");
          setTestCaseInput2("");
          setTestCaseOutput2("");
          setTestCaseInput3("");
          setTestCaseOutput3("");
        }
      } else if (location.state.sid === 6) {
        setCurrentQsID(navArray[e.target.id].paraId);
        set_para_title(navArray[e.target.id].title);
        set_para(navArray[e.target.id].para);
        set_para_qs(navArray[e.target.id].questions);
      }
    }
    document.getElementById(location.state.type).selected = "selected";
  }
  function reportWindowSize(e) {
    setWindowHeight(window.screen.height);
  }
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file !== undefined) {
      previewFile(file);
      setSelectedFile(file);
      setFileInputState(e.target.value);
    } else {
      setPreviewSource("");
      setSelectedFile();
      setFileInputState();
    }
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  function del_Image() {
    set_confirm_yes_func(() => confirm_yes);
    set_confirm_no_func(() => confirm_no);
    set_confirm_dialog_msg("Are you sure you want to remove this image?");
    set_confirm_dialog_title("Remove?");
    setShowConfirmDialogBox(true);
  }
  function confirm_yes() {
    setDelImage(true);
  }
  function confirm_discard_yes() {
    window.location.reload();
  }
  function confirm_discard_no() {
    var ele = document.getElementById("actionBut");
    ele.focus();
    ele.classList.toggle("blinking");
  }
  function confirm_no() {}
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
      <ConfirmDialogBox
        showConfirmDialogBox={showConfirmDialogBox}
        setShowConfirmDialogBox={setShowConfirmDialogBox}
        confirm_no={confirm_no_func}
        confirm_yes={confirm_yes_func}
        arg={argConfirmModal}
        title={confirm_dialog_title}
        msg={confirm_dialog_msg}
      />
      <form onSubmit={(e) => handleSubmit(e)} id="sbForm">
        <input name="sectionName" value={location.state.sectionName} hidden />
        <input
          name="action"
          value={
            (isNew && currentQsNo == navArray.length) || navArray.length === 0
              ? "Save"
              : "Update"
          }
          hidden
        />
        <Row>
          <Col md={9}>
            <div
              id="SETQS"
              className="basicRec SetQuestion"
              style={{
                margin: "0px 50px",
                minHeight: window.screen.height - 500,
              }}
            >
              <div style={{ padding: "20px 36px 0 36px" }}>
                {!isCoding && !isPersonality && (
                  <div
                    style={{ marginBottom: "20px" }}
                    hidden={isAnalytical ? true : false}
                  >
                    <div className="form-group">
                      <label for="selectSetQs">
                        <b style={{ color: "red" }}>*</b>Type :
                      </label>
                      <select
                        className="form-select"
                        name="type"
                        aria-label="Default select example"
                        hidden={isAnalytical ? true : false}
                        disabled={!isUpdate}
                        required
                      >
                        <option id="Easy">Easy</option>
                        <option id="Medium">Medium</option>
                        <option id="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                )}
                {isAnalytical && (
                  <>
                    {isNew && currentQsNo === navArray.length && (
                      <>
                        <div className="form-group">
                          <label for="paragraphTitle">
                            <b style={{ color: "red" }}>*</b>Paragraph Title :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={""}
                            form="sbForm"
                            name={`paragraphTitle`}
                            id="paragraphTitle"
                            placeholder="Enter Paragraph Title"
                            rows="1"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label for="paragraph">
                            <b style={{ color: "red" }}>*</b>Paragraph :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={""}
                            form="sbForm"
                            name={`paragraph`}
                            id="paragraph"
                            placeholder="Enter Paragraph"
                            rows="4"
                            style={{ maxWidth: "100%" }}
                            required
                          ></textarea>
                        </div>
                        <div className="qsArr">
                          <AnalyticalQsComp
                            para_qs={para_qs}
                            currentQsID={currentQsID}
                            isUpdate={isUpdate}
                            addOptInSubQs={addOptInSubQs}
                            delOptInSubQs={delOptInSubQs}
                            set_rerenderState={set_rerenderState}
                            rerenderState={rerenderState}
                          ></AnalyticalQsComp>
                        </div>
                      </>
                    )}
                    {!isNew && (
                      <>
                        <div className="form-group">
                          <label for="paragraphTitle">
                            <b style={{ color: "red" }}>*</b>Paragraph Title :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={para_title}
                            form="sbForm"
                            name={`paragraphTitle`}
                            id="paragraphTitle"
                            placeholder="Enter Paragraph Title"
                            rows="1"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label for="paragraph">
                            <b style={{ color: "red" }}>*</b>Paragraph :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={para}
                            form="sbForm"
                            name={`paragraph`}
                            id="paragraph"
                            placeholder="Enter Paragraph"
                            rows="4"
                            style={{ maxWidth: "100%" }}
                            required
                          ></textarea>
                        </div>
                        <div className="qsArr">
                          <AnalyticalQsComp
                            para_qs={para_qs}
                            currentQsID={currentQsID}
                            isUpdate={isUpdate}
                            addOptInSubQs={addOptInSubQs}
                            delOptInSubQs={delOptInSubQs}
                            set_rerenderState={set_rerenderState}
                            rerenderState={rerenderState}
                          ></AnalyticalQsComp>
                        </div>
                      </>
                    )}
                  </>
                )}
                <Row>
                  {!isNew && !isAnalytical && (
                    <div className="form-group">
                      <label for="qsSetQs">
                        <b style={{ color: "red" }}>*</b>Question :{" "}
                      </label>
                      <textarea
                        className="form-control form-field style-4"
                        disabled={!isUpdate}
                        defaultValue={currentQs}
                        form="sbForm"
                        name={`question${currentQsID}`}
                        id="qsSetQs"
                        placeholder="Enter Question"
                        rows="3"
                        style={{ maxWidth: "100%" }}
                        required
                      ></textarea>
                    </div>
                  )}
                  {isNew && !isAnalytical && currentQsNo === navArray.length && (
                    <div className="form-group">
                      <label for="qsSetQs">
                        <b style={{ color: "red" }}>*</b>Question :{" "}
                      </label>
                      <textarea
                        className="form-control form-field style-4"
                        disabled={!isUpdate}
                        defaultValue={""}
                        form="sbForm"
                        name={`question${currentQsID}`}
                        id="qsSetQs"
                        placeholder="Enter Question"
                        rows="3"
                        style={{ maxWidth: "100%" }}
                        required
                      ></textarea>
                    </div>
                  )}
                </Row>
                {!isCoding &&
                  !isPersonality &&
                  !isAnalytical &&
                  isNew &&
                  currentQsNo === navArray.length && (
                    <Row>
                      <div style={{ margin: "10px 0" }}>
                        <div className="form-group">
                          <label for="selectSetQs">Image :</label>
                          <input
                            id="fileInput"
                            type="file"
                            name="image"
                            style={{ marginLeft: "20px" }}
                            onChange={handleFileInputChange}
                            value=""
                            className="form-input"
                            accept="image/png, image/jpeg"
                          />
                          {previewSource && (
                            <div id="zoomImg">
                              <Zoom>
                                <img
                                  src={previewSource}
                                  alt="chosen"
                                  style={{
                                    height: "200px",
                                    padding: "30px",
                                    outline: "none",
                                    border: "0",
                                  }}
                                />
                              </Zoom>{" "}
                            </div>
                          )}
                        </div>
                      </div>
                    </Row>
                  )}
                {!isCoding && !isPersonality && !isAnalytical && !isNew && (
                  <Row>
                    <div style={{ margin: "10px 0" }}>
                      <div className="form-group">
                        <label for="selectSetQs">Image :</label>
                        <input
                          id="fileInput"
                          type="file"
                          name="image"
                          style={{ marginLeft: "20px" }}
                          onChange={handleFileInputChange}
                          value={fileInputState}
                          disabled={!isUpdate}
                          className="form-input"
                          accept="image/png, image/jpeg"
                        />
                        {previewSource && (
                          <div id="zoomImg">
                            <Zoom>
                              <img
                                src={previewSource}
                                alt="chosen"
                                style={{
                                  height: "200px",
                                  padding: "30px",
                                  outline: "none",
                                  border: "0",
                                }}
                              />
                            </Zoom>{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  </Row>
                )}
                {!isCoding &&
                  !isPersonality &&
                  !isAnalytical &&
                  !isNew &&
                  !delImage && (
                    <Row>
                      {isUpdate && imgDB !== null && (
                        <Col md={2}>
                          <button
                            type="button"
                            className="btn"
                            onClick={(e) => {
                              del_Image();
                            }}
                            style={{
                              backgroundColor: "red",
                              borderRadius: "100px",
                              height: "30px",
                              width: "30px",

                              padding: "0",
                            }}
                          >
                            <i
                              className="fa fa-x"
                              title="Remove this image"
                              style={{ color: "white" }}
                            ></i>
                          </button>
                        </Col>
                      )}
                      <Col>
                        {imgDB !== null && (
                          <div style={{ margin: "10px 0" }}>
                            <div id="zoomImg" className="form-group">
                              <Zoom>
                                <Image
                                  cloudName={
                                    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
                                  }
                                  public_id={imgDB}
                                  width="300"
                                  crop="scale"
                                  alt="img"
                                ></Image>
                              </Zoom>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}

                {!isCoding && (
                  <div
                    className="scrollbar"
                    style={{
                      maxHeight: "225px",
                      margin: "5px",
                      maxWidth: "100%",
                      backgroundColor: "white",
                    }}
                    id="style-4"
                  >
                    {opt !== undefined &&
                      opt.map((x, index) => {
                        return (
                          <>
                            <p style={{ padding: "5px 0", margin: "10px 0px" }}>
                              <div
                                className="form-check"
                                style={{ paddingLeft: "0" }}
                              >
                                <input
                                  type="radio"
                                  className="form-check-radio setQsRadio"
                                  name="correctOpt"
                                  disabled={!isUpdate}
                                  checked={x.marks !== 0 ? true : null}
                                  value={`Option${index + 1}`}
                                  id={`flexCheckDefault${index + 1}`}
                                  required
                                />
                                <label
                                  className="form-check-label"
                                  style={{
                                    marginLeft: "15px",
                                    fontWeight: "400",
                                    width: "90%",
                                  }}
                                  for={`flexCheckDefault${index + 1}`}
                                >
                                  <input
                                    type="text"
                                    className="form-control"
                                    disabled={!isUpdate}
                                    defaultValue={x.title}
                                    name={`Option${index + 1}`}
                                    placeholder={`Enter Option ${index + 1}`}
                                    id={`Option${index + 1}`}
                                    required
                                  />
                                </label>
                              </div>
                            </p>
                          </>
                        );
                      })}
                  </div>
                )}
                {isCoding && (
                  <div>
                    <Row>
                      {isNew && currentQsNo === navArray.length && (
                        <div className="form-group">
                          <label for="qsSetInputFormat">
                            <b style={{ color: "red" }}>*</b>Input Format :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={""}
                            form="sbForm"
                            name={`inputFormat`}
                            id="qsSetInputFormat"
                            placeholder="Enter Input Format"
                            rows="2"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                      )}
                      {!isNew && (
                        <div className="form-group">
                          <label for="qsSetInputFormat">
                            <b style={{ color: "red" }}>*</b>Input Format :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={inputF}
                            form="sbForm"
                            name={`inputFormat`}
                            id="qsSetInputFormat"
                            placeholder="Enter Input Format"
                            rows="2"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                      )}
                    </Row>

                    <Row>
                      {isNew && currentQsNo === navArray.length && (
                        <div className="form-group">
                          <label for="qsSetOutputFormat">
                            <b style={{ color: "red" }}>*</b>Output Format :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={""}
                            form="sbForm"
                            name={`outputFormat`}
                            id="qsSetOutputFormat"
                            placeholder="Enter Output Format"
                            rows="2"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                      )}
                      {!isNew && (
                        <div className="form-group">
                          <label for="qsSetOutputFormat">
                            <b style={{ color: "red" }}>*</b>Output Format :{" "}
                          </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={outputF}
                            form="sbForm"
                            name={`outputFormat`}
                            id="qsSetOutputFormat"
                            placeholder="Enter Output Format"
                            rows="2"
                            style={{ maxWidth: "100%", resize: "none" }}
                            required
                          ></textarea>
                        </div>
                      )}
                    </Row>
                    <Row>
                      <Col md={6}>
                        {!isNew && (
                          <div className="form-group">
                            <label for="qsSetConstraints">
                              <b style={{ color: "red" }}>*</b>Constraints :{" "}
                            </label>
                            <textarea
                              className="form-control form-field style-4"
                              disabled={!isUpdate}
                              defaultValue={
                                isNew && currentQsNo == navArray.length
                                  ? ""
                                  : constraints
                              }
                              form="sbForm"
                              name={`constraints`}
                              id="qsSetConstraints"
                              placeholder="Enter Constraints"
                              rows="2"
                              style={{ maxWidth: "100%", resize: "none" }}
                              required
                            ></textarea>
                          </div>
                        )}
                        {isNew && currentQsNo === navArray.length && (
                          <div className="form-group">
                            <label for="qsSetConstraints">
                              <b style={{ color: "red" }}>*</b>Constraints :{" "}
                            </label>
                            <textarea
                              className="form-control form-field style-4"
                              disabled={!isUpdate}
                              defaultValue={""}
                              form="sbForm"
                              name={`constraints`}
                              id="qsSetConstraints"
                              placeholder="Enter Constraints"
                              rows="2"
                              style={{ maxWidth: "100%", resize: "none" }}
                              required
                            ></textarea>
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        {isCoding && (
                          <div style={{ marginBottom: "20px" }}>
                            <div className="form-group">
                              <b style={{ color: "red" }}>*</b>
                              <label for="selectSetQs">Type :</label>
                              <select
                                className="form-select"
                                name="type"
                                aria-label="Default select example"
                                disabled={!isUpdate}
                              >
                                <option id="Easy">Easy</option>
                                <option id="Medium">Medium</option>
                                <option id="Hard">Hard</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      {isNew && currentQsNo === navArray.length && (
                        <>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetSampleInput">
                                <b style={{ color: "red" }}>*</b>Sample Input :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`sampleInput`}
                                id="qsSetSampleInput"
                                placeholder="Enter Sample Input"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetSampleOutput">
                                <b style={{ color: "red" }}>*</b> Sample Output
                                :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`sampleOutput`}
                                id="qsSetSampleOutput"
                                placeholder="Enter Sample Output"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                      {!isNew && (
                        <>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetSampleInput">
                                <b style={{ color: "red" }}>*</b>Sample Input :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={sampleInput}
                                form="sbForm"
                                name={`sampleInput`}
                                id="qsSetSampleInput"
                                placeholder="Enter Sample Input"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetSampleOutput">
                                <b style={{ color: "red" }}>*</b>Sample Output :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={sampleOutput}
                                form="sbForm"
                                name={`sampleOutput`}
                                id="qsSetSampleOutput"
                                placeholder="Enter Sample Output"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    <Row>
                      {isNew && currentQsNo === navArray.length && (
                        <div className="form-group">
                          <label for="qsSetExplanation">Explanation : </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={""}
                            form="sbForm"
                            name={`explanation`}
                            id="qsSetExplanation"
                            placeholder="Enter Explanation"
                            rows="3"
                            style={{ maxWidth: "100%" }}
                          ></textarea>
                        </div>
                      )}
                      {!isNew && (
                        <div className="form-group">
                          <label for="qsSetExplanation">Explanation : </label>
                          <textarea
                            className="form-control form-field style-4"
                            disabled={!isUpdate}
                            defaultValue={explanation}
                            form="sbForm"
                            name={`explanation`}
                            id="qsSetExplanation"
                            placeholder="Enter Explanation"
                            rows="3"
                            style={{ maxWidth: "100%" }}
                          ></textarea>
                        </div>
                      )}
                    </Row>
                    <Row>
                      {!isNew && (
                        <>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase1Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                1 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseInput1}
                                form="sbForm"
                                name={`testCase1Input`}
                                id="qsSetTestCase1Input"
                                placeholder="Enter TestCase Input 1"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase1Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                1 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseOutput1}
                                form="sbForm"
                                name={`testCase1Output`}
                                id="qsSetTestCase1Output"
                                placeholder="Enter TestCase Output 1"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                      {isNew && currentQsNo === navArray.length && (
                        <>
                          {" "}
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase1Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                1 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase1Input`}
                                id="qsSetTestCase1Input"
                                placeholder="Enter TestCase Input 1"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase1Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                1 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase1Output`}
                                id="qsSetTestCase1Output"
                                placeholder="Enter TestCase Output 1"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    <Row>
                      {!isNew && (
                        <>
                          {" "}
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase2Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                2 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseInput2}
                                form="sbForm"
                                name={`testCase2Input`}
                                id="qsSetTestCase2Input"
                                placeholder="Enter TestCase Input 2"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase2Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                2 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseOutput2}
                                form="sbForm"
                                name={`testCase2Output`}
                                id="qsSetTestCase2Output"
                                placeholder="Enter TestCase Output 2"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}

                      {isNew && currentQsNo === navArray.length && (
                        <>
                          {" "}
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase2Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                2 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase2Input`}
                                id="qsSetTestCase2Input"
                                placeholder="Enter TestCase Input 2"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase2Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                2 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase2Output`}
                                id="qsSetTestCase2Output"
                                placeholder="Enter TestCase Output 2"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                    <Row>
                      {!isNew && (
                        <>
                          {" "}
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase3Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                3 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseInput3}
                                form="sbForm"
                                name={`testCase3Input`}
                                id="qsSetTestCase3Input"
                                placeholder="Enter TestCase Input 3"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase3Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                3 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={testCaseOutput3}
                                form="sbForm"
                                name={`testCase3Output`}
                                id="qsSetTestCase3Output"
                                placeholder="Enter TestCase Output 3"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                      {isNew && currentQsNo === navArray.length && (
                        <>
                          {" "}
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase3Input">
                                <b style={{ color: "red" }}>*</b>TestCase Input
                                3 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase3Input`}
                                id="qsSetTestCase3Input"
                                placeholder="Enter TestCase Input 3"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="form-group">
                              <label for="qsSetTestCase3Output">
                                <b style={{ color: "red" }}>*</b>TestCase Output
                                3 :{" "}
                              </label>
                              <textarea
                                className="form-control form-field style-4"
                                disabled={!isUpdate}
                                defaultValue={""}
                                form="sbForm"
                                name={`testCase3Output`}
                                id="qsSetTestCase3Output"
                                placeholder="Enter TestCase Output 3"
                                rows="2"
                                style={{ maxWidth: "100%", resize: "none" }}
                                required
                              ></textarea>
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                  </div>
                )}
              </div>
              {isUpdate && !isCoding && !isPersonality && (
                <>
                  <button
                    className="btn"
                    type="button"
                    onClick={(e) => (isAnalytical ? addParaQs(e) : addOpt(e))}
                    style={{
                      backgroundColor: "#10B65C",
                      borderRadius: "100px",
                      marginLeft: "5%",
                      marginBottom: "10px",
                    }}
                  >
                    <i className="fa fa-add" style={{ color: "white" }}></i>
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={(e) => (isAnalytical ? delParaQs(e) : delOpt(e))}
                    style={{
                      backgroundColor: "#10B65C",
                      borderRadius: "100px",
                      marginLeft: "5%",
                      marginBottom: "10px",
                    }}
                  >
                    <i className="fa fa-trash" style={{ color: "white" }}></i>
                  </button>
                </>
              )}
              {isUpdate ? (
                <button
                  className="btn"
                  type="button"
                  onClick={(e) => {
                    set_confirm_yes_func(() => confirm_discard_yes);
                    set_confirm_no_func(() => confirm_discard_no);
                    set_confirm_dialog_msg(
                      "Do you want to discard these changes?"
                    );
                    set_confirm_dialog_title("Discard?");
                    setShowConfirmDialogBox(true);
                  }}
                  style={{
                    backgroundColor: "#10B65C",
                    borderRadius: "100px",
                    marginLeft: "5%",
                    marginBottom: "10px",
                    marginTop: "5px",
                  }}
                >
                  <i className="fa fa-edit" style={{ color: "white" }}></i>
                </button>
              ) : (
                <button
                  className="btn"
                  type="button"
                  onClick={(e) => {
                    setIsUpdate(!isUpdate);
                  }}
                  style={{
                    backgroundColor: "#10B65C",
                    borderRadius: "100px",
                    marginLeft: "5%",
                    marginBottom: "10px",
                    marginTop: "5px",
                  }}
                >
                  <i className="fa fa-edit" style={{ color: "white" }}></i>
                </button>
              )}
            </div>
          </Col>
          <Col md={3}>
            <div className="basicRec" id="wrapper">
              {isUpdate ? (
                <>
                  <div
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      padding: "10px 10px 0 10px",
                    }}
                  >
                    {" "}
                    Question Navigator
                    <button
                      className="btn"
                      type="button"
                      style={{ padding: "0" }}
                      onClick={(e) => {}}
                    >
                      <i className="fa fa-trash" style={{ color: "grey" }}></i>
                    </button>
                  </div>
                  <div
                    className="scrollbar"
                    style={{
                      height: window.screen.height - 500,
                      padding: "5px",
                      maxWidth: "100%",
                      backgroundColor: "#e9ecef",
                    }}
                    id="style-4"
                  >
                    {navArray !== undefined &&
                      navArray.map((ittr, index) => {
                        return (
                          <>
                            <div
                              style={{
                                boxShadow: `rgba(0, 0, 0, 0.02) 0 1px 3px 0`,
                                backgroundColor: "#e9ecef",
                                minHeight: "40px",
                                padding: "10px 5px 10px 5px",
                                boxSizing: `border-box`,
                                width: "100%",
                                marginBottom: "2px",
                                color: `rgba(0, 0, 0, 0.85)`,
                              }}
                            >
                              <Row>
                                <Col md={1}>
                                  <input
                                    className="styled-checkbox"
                                    style={{ display: "none" }}
                                    disabled
                                    id={`styled-checkbox-${index}`}
                                    type="checkbox"
                                    onClick={(e) => {}}
                                    value={`value${index}`}
                                  />
                                </Col>
                                <Col md={11}>
                                  <div
                                    id={index}
                                    className="qsNavButt"
                                    style={{
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {isAnalytical
                                      ? ittr.title
                                      : isCoding
                                      ? ittr.question || "New Qs"
                                      : ittr.ques || "New Qs"}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </>
                        );
                      })}
                    {navArray !== undefined && navArray.length === 0
                      ? (setIsNew(true),
                        setIsUpdate(true),
                        isAnalytical
                          ? setNavArray((prev) => [
                              ...prev,
                              {
                                title: "New Question",
                                paraId: "New",
                                quetions: [],
                              },
                            ])
                          : setNavArray((prev) => [...prev, -1]),
                        setCurrentQsNo(navArray.length + 1),
                        setCurrentQsID("New"),
                        setOpt([]))
                      : null}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      justifyContent: "space-between",
                      display: "flex",
                      padding: "10px 10px 0 10px",
                    }}
                  >
                    Question Navigator
                    <button
                      className="btn"
                      type="button"
                      style={{ padding: "0" }}
                      onClick={(e) => delQuestion(e)}
                    >
                      <i className="fa fa-trash" style={{ color: "red" }}></i>
                    </button>
                  </div>
                  <div
                    className="scrollbar"
                    style={{
                      height: window.screen.height - 500,
                      padding: "5px",
                      maxWidth: "100%",
                      backgroundColor: "white",
                    }}
                    id="style-4"
                  >
                    {navArray !== undefined &&
                      navArray.map((ittr, index) => {
                        return (
                          <>
                            <div
                              style={{
                                boxShadow: `rgba(0, 0, 0, 0.02) 0 1px 3px 0`,
                                backgroundColor: "#e9ecef",
                                minHeight: "40px",
                                padding: "10px 5px 10px 5px",
                                boxSizing: `border-box`,
                                width: "100%",
                                marginBottom: "2px",
                                color: `rgba(0, 0, 0, 0.85)`,
                              }}
                            >
                              <Row>
                                <Col md={1}>
                                  <input
                                    className="styled-checkbox"
                                    style={{ display: "none" }}
                                    name="styleCheckBox"
                                    id={`styled-checkbox-${index}`}
                                    type="checkbox"
                                    onClick={(e) => {}}
                                    value={
                                      isAnalytical
                                        ? `valueCheckBox${ittr.paraId}`
                                        : `valueCheckBox${ittr.id}`
                                    }
                                  />
                                </Col>
                                <Col md={11}>
                                  <div
                                    id={index}
                                    className="qsNavBut"
                                    onClick={fillData}
                                    style={{
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {isAnalytical
                                      ? ittr.title
                                      : isCoding
                                      ? ittr.question || "New Qs"
                                      : ittr.ques || "New Qs"}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </>
                        );
                      })}
                    {navArray !== undefined && navArray.length === 0 && (
                      <h5>Add question to view</h5>
                    )}
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
        <Row style={{ paddingTop: "20px", paddingLeft: "10%" }}>
          <button
            style={{ color: "white" }}
            type="button"
            onClick={(e) =>
              navigate("/admin/newTest", {
                state: { sid: location.state.sid - 1 },
              })
            }
            className="btn scTest"
          >
            Back
          </button>

          {(isUpdate || navArray.length === 0) && (
            <>
              <button
                style={{ color: "white" }}
                type="submit"
                className="btn scTest flashBut"
                id="actionBut"
              >
                {(isNew && currentQsNo == navArray.length) ||
                navArray.length === 0
                  ? "Save"
                  : "Update"}
              </button>
            </>
          )}

          {!isNew && !isUpdate && navArray.length !== 0 && (
            <button
              style={{ color: "white" }}
              className="btn scTest"
              type="button"
              onClick={(e) => {
                setIsNew(true);
                setIsUpdate(true);
                isAnalytical
                  ? setNavArray((prev) => [
                      ...prev,
                      { title: "New Question", paraId: "New", quetions: [] },
                    ])
                  : setNavArray((prev) => [...prev, -1]);
                setCurrentQsNo(navArray.length + 1);
                setCurrentQsID("New");
                set_para_qs([]);
                setOpt([]);
                setPreviewSource("");
              }}
            >
              Add new Question
            </button>
          )}
        </Row>
      </form>
      </>:<MobileWidth/>}
    </div>
  );
}

export default SetQuestion;
