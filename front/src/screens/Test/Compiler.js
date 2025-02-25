import React, { Component, useEffect, useState } from "react";
import { Col, Row, Modal, Button, Tabs, Tab } from "react-bootstrap";
import CodingQsComp from "../../components/TestScreeen/CodingQsComp";
import TestHeaderComp from "../../components/TestScreeen/TestHeaderComp";
import "../../css/Compiler.css";
import $ from "jquery";
import { useNavigate } from "react-router";
import CustomTimer from "../Admin/CustomTimer";
import getCurrentTime from "../../components/TestScreeen/dateCalc";
import axiosInstance from "../../axios";
import { isExpired } from "react-jwt";
import ACEEditor from "../../components/TestScreeen/AceEditor";
import ProtectUrl from "../../components/TestScreeen/ProtectUrl";
import Alert from "../../components/Admin/Alert";
import MobileWidth from "../../components/MobileWidth";
import { useMediaQuery } from "react-responsive";
import { AiFillWarning } from "react-icons/ai";
import createActivityDetector from "activity-detector";

export default function Compiler() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)",
  });
  const [inputT, setInput] = useState();
  const [inputT_question_1, setInput_question_1] = useState();
  const [inputT_question_2, setInput_question_2] = useState();
  const [inputT_question_3, setInput_question_3] = useState();
  const [current_qs, set_current_qs] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [dangerMsg, setDangerMsg] = useState("");
  const [isAlertDangerMsgLoaded, setIsAlertDangerMsgLoaded] = useState(false);
  const [isAlertSuccessMsgLoaded, setIsAlertSuccessMsgLoaded] = useState(false);
  const [language_id, setLanguage_id] = useState();
  const [language_id_question_1, setLanguage_id_question_1] = useState();
  const [language_id_question_2, setLanguage_id_question_2] = useState();
  const [language_id_question_3, setLanguage_id_question_3] = useState();

  const [user_input, setUser_input] = useState();
  const [user_input_question_1, setUser_input_question_1] = useState();
  const [user_input_question_2, setUser_input_question_2] = useState();
  const [user_input_question_3, setUser_input_question_3] = useState();

  const [customInputCheck, setCustomInputCheck] = useState(false);

  const [isSubmitCode_qs1, setIsSubmitCode_qs1] = useState(); // (t/f)
  const [isSubmitCode_qs2, setIsSubmitCode_qs2] = useState(); // (t/f)
  const [isSubmitCode_qs3, setIsSubmitCode_qs3] = useState(); // (t/f)

  const [submitCode_qs1, set_submitCode_qs1] = useState(false); // (t/f)
  const [submitCode_qs2, set_submitCode_qs2] = useState(false); // (t/f)
  const [submitCode_qs3, set_submitCode_qs3] = useState(false); // (t/f)

  const [nextSecConfirmation, setNextSecConfirmation] = useState(false); // (t/f)
  const [q1_run_output, set_q1_run_output] = useState();
  const [q1_testCase_1_output, set_q1_testCase_1_output] = useState();
  const [q1_testCase_2_output, set_q1_testCase_2_output] = useState();
  const [q1_testCase_3_output, set_q1_testCase_3_output] = useState();
  const [q1_testCase_Current_output, set_q1_testCase_Current_output] =
    useState(); //generalized for Q1
  const [q1_testCase_1_output_error, set_q1_testCase_1_output_error] =
    useState(); // (t/f)
  const [q1_testCase_2_output_error, set_q1_testCase_2_output_error] =
    useState(); // (t/f)
  const [q1_testCase_3_output_error, set_q1_testCase_3_output_error] =
    useState(); // (t/f)

  const [q2_run_output, set_q2_run_output] = useState();
  const [q2_testCase_1_output, set_q2_testCase_1_output] = useState();
  const [q2_testCase_2_output, set_q2_testCase_2_output] = useState();
  const [q2_testCase_3_output, set_q2_testCase_3_output] = useState();
  const [q2_testCase_Current_output, set_q2_testCase_Current_output] =
    useState(); //generalized for Q2
  const [q2_testCase_1_output_error, set_q2_testCase_1_output_error] =
    useState(); // (t/f)
  const [q2_testCase_2_output_error, set_q2_testCase_2_output_error] =
    useState(); // (t/f)
  const [q2_testCase_3_output_error, set_q2_testCase_3_output_error] =
    useState(); // (t/f)

  const [q3_run_output, set_q3_run_output] = useState();
  const [q3_testCase_1_output, set_q3_testCase_1_output] = useState();
  const [q3_testCase_2_output, set_q3_testCase_2_output] = useState();
  const [q3_testCase_3_output, set_q3_testCase_3_output] = useState();
  const [q3_testCase_Current_output, set_q3_testCase_Current_output] =
    useState(); //generalized for Q2
  const [q3_testCase_1_output_error, set_q3_testCase_1_output_error] =
    useState(); // (t/f)
  const [q3_testCase_2_output_error, set_q3_testCase_2_output_error] =
    useState(); // (t/f)
  const [q3_testCase_3_output_error, set_q3_testCase_3_output_error] =
    useState(); // (t/f)

  //testcase in
  const [q1_testCase_1_input, set_q1_testCase_1_input] = useState();
  const [q1_testCase_2_input, set_q1_testCase_2_input] = useState();
  const [q1_testCase_3_input, set_q1_testCase_3_input] = useState();

  const [q2_testCase_1_input, set_q2_testCase_1_input] = useState();
  const [q2_testCase_2_input, set_q2_testCase_2_input] = useState();
  const [q2_testCase_3_input, set_q2_testCase_3_input] = useState();

  const [q3_testCase_1_input, set_q3_testCase_1_input] = useState();
  const [q3_testCase_2_input, set_q3_testCase_2_input] = useState();
  const [q3_testCase_3_input, set_q3_testCase_3_input] = useState();

  //testcase out
  const [q1_testCase_1_expected_output, set_q1_testCase_1_expected_output] =
    useState();
  const [q1_testCase_2_expected_output, set_q1_testCase_2_expected_output] =
    useState();
  const [q1_testCase_3_expected_output, set_q1_testCase_3_expected_output] =
    useState();

  const [q2_testCase_1_expected_output, set_q2_testCase_1_expected_output] =
    useState();
  const [q2_testCase_2_expected_output, set_q2_testCase_2_expected_output] =
    useState();
  const [q2_testCase_3_expected_output, set_q2_testCase_3_expected_output] =
    useState();

  const [q3_testCase_1_expected_output, set_q3_testCase_1_expected_output] =
    useState();
  const [q3_testCase_2_expected_output, set_q3_testCase_2_expected_output] =
    useState();
  const [q3_testCase_3_expected_output, set_q3_testCase_3_expected_output] =
    useState();

  //three qs
  const [db_data, set_db_data] = useState();
  const [question_1, set_question_1] = useState({});
  const [question_2, set_question_2] = useState();
  const [question_3, set_question_3] = useState();
  const [question_current, set_question_current] = useState({
    question: "qs1",
    input_format: "input format",
    output_format: "output_format",
    constraints: "constraints",
    sample_input_1: "sample_input_1",
    sample_output_1: "sample_output_1",
    explanation: "explanation",
  });
  //prev pages
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [reload, isReload] = useState(false);
  const [render_state, set_render_state] = useState(false);
  const handleClose = () => {
    setShow(false);
    setMd(true);
  };
  const [countWindowAway, setCountWindowAway] = useState(0);
  const [countWindowAwayModal, setCountWindowAwayModal] = useState(false);
  const [testFinshBool, setTestFinishBool] = useState(false);
  const [md, setMd] = useState(false);
  const [timeFF, setTimeFF] = useState();
  const [isValidPath, setIsValidPath] = useState(false);
  const activityDetector = createActivityDetector({
    timeToIdle: 6000000000000000_0000,
    autoInit: false,
  });
  activityDetector.on("idle", () => {
    windowAway();
  });

  useEffect(() => {
    window.onkeydown = function(e) {
      if(e.keyCode == 123) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
         return false;
      }
    }
    activityDetector.init();
    function fullscreenc() {
      var full_screen_element = document.fullscreenElement;

      if (full_screen_element === null) {
        setShow(true);
        setMd(false);
        isReload(true);
      }
    }
    function contextm(event) {
      event.preventDefault();
    }
    window.addEventListener("contextmenu", contextm);
    window.addEventListener("fullscreenchange", fullscreenc);
    let flag = true;
    if (
      !(sessionStorage.getItem("test2") && !sessionStorage.getItem("test4"))
    ) {
      if (!sessionStorage.getItem("test4")) {
        let az = ProtectUrl.protect();
        if (az !== "") {
          navigate(az);
        } else {
          navigate(-1);
        }
        flag = false;
      }
    }
    if (flag) {
      setIsValidPath(true);
      var full_screen_element = document.fullscreenElement;

      if (full_screen_element === null) {
        setShow(true);
        setMd(false);
        isReload(true);
      }
      if (!sessionStorage.getItem("test4")) {
        let ax = JSON.parse(sessionStorage.getItem("test2"));
        if (sessionStorage.getItem("test2")) {
          var user = ax["username"];
          let ar = ax["marks"];
          let maxMarks = ax["maxMarks"];
          let gotMarks = ax["marks"];
          let total = 0;
          for (let i = 0; i < ar.length; i++) {
            if (ar[i] !== -1) total = total + ar[i];
          }
          axiosInstance
            .post("api/marks/2", {
              data: {
                username: user,
                marks: total,
                maxMarks: maxMarks,
                testId: sessionStorage.getItem("testId"),
                gotMarks: gotMarks,
                check_result: 0,
              },
            })
            .then((res) => {
              sessionStorage.removeItem("test2");
            })
            .catch((e) => console.log(e));
        }
        let txx = getCurrentTime();
        let hh = txx.hh;
        let mm = txx.mm;
        let ss = txx.ss;
        sessionStorage.setItem(
          "test4",
          JSON.stringify({
            username: user,
            STime: Date(),
            FSTimer: "10",
            marks: [0, 0, 0],
            isFirstTime: true,
            maxMarks: [10, 20, 30],

            strtTime: hh + ":" + mm + ":" + ss,
          })
        );
      }
      var test = JSON.parse(sessionStorage.getItem("test4"));
      const token = sessionStorage.getItem("access_token");
      const isMyTokenExpired = isExpired(token);
      //  const isMyTokenExpired = false;

      if (isMyTokenExpired) {
        navigate("/login");
        return;
      } else {
        if (sessionStorage.getItem("result")) {
          navigate("/result");
        } else {
          // navigate(ProtectUrl.protect())
          let data;
          let xx = sessionStorage.getItem("testId");
          const getData = async () =>
            await axiosInstance.get(`api/codingTests/${xx}`).then((res) => {
              let a = converttime(res.data.time);
              var tf = a;
              // setTimeFF(tf);

              var ob = new Date();
              var h = (ob.getHours() < 10 ? "0" : "") + ob.getHours();
              var m = (ob.getMinutes() < 10 ? "0" : "") + ob.getMinutes();
              var s = (ob.getSeconds() < 10 ? "0" : "") + ob.getSeconds();

              var timeStart = new Date(
                new Date().toLocaleDateString() + " " + test["strtTime"]
              );
              var timeEnd = new Date(
                new Date().toLocaleDateString() + " " + h + ":" + m + ":" + s
              );
              var hourDiff = (timeEnd - timeStart) / 1000;
              setTimeFF(tf - hourDiff);

              set_db_data(res.data.cQs);
              data = res.data.cQs;
              //from db

              if (Object.keys(data[0]).length !== 0) {
                set_question_1(data[0]);
                set_question_current(data[0]);
                set_q1_testCase_1_input(data[0].test_case_input[0]);
                set_q1_testCase_1_expected_output(data[0].test_case_output[0]);
                set_q1_testCase_2_input(data[0].test_case_input[1]);
                set_q1_testCase_2_expected_output(data[0].test_case_output[1]);
                set_q1_testCase_3_input(data[0].test_case_input[2]);
                set_q1_testCase_3_expected_output(data[0].test_case_output[2]);
              }
              if (Object.keys(data[1]).length !== 0) {
                set_question_2(data[1]);
                set_q2_testCase_1_input(data[1].test_case_input[0]);

                set_q2_testCase_1_expected_output(data[1].test_case_output[0]);
                set_q2_testCase_2_input(data[1].test_case_input[1]);
                set_q2_testCase_2_expected_output(data[1].test_case_output[1]);
                set_q2_testCase_3_input(data[1].test_case_input[2]);
                set_q2_testCase_3_expected_output(data[1].test_case_output[2]);
              }
              if (Object.keys(data[2]).length !== 0) {
                set_question_3(data[2]);
                set_q3_testCase_1_input(data[2].test_case_input[0]);

                set_q3_testCase_1_expected_output(data[2].test_case_output[0]);
                set_q3_testCase_2_input(data[2].test_case_input[1]);
                set_q3_testCase_2_expected_output(data[2].test_case_output[1]);
                set_q3_testCase_3_input(data[2].test_case_input[2]);
                set_q3_testCase_3_expected_output(data[2].test_case_output[2]);
              }
            });
          getData();
          setInput(JSON.parse(sessionStorage.getItem("test4"))["input_1"]);
          setInput_question_1(
            JSON.parse(sessionStorage.getItem("test4"))["input_1"]
          );
          setInput_question_2(
            JSON.parse(sessionStorage.getItem("test4"))["input_2"]
          );
          setInput_question_3(
            JSON.parse(sessionStorage.getItem("test4"))["input_3"]
          );

          setUser_input(sessionStorage.getItem("test4")["user_input_1"] || ``);
          setUser_input(
            JSON.parse(sessionStorage.getItem("test4"))["user_input_1"] || ``
          );
          setUser_input_question_1(
            JSON.parse(sessionStorage.getItem("test4"))["user_input_1"] || ``
          );
          setUser_input_question_2(
            JSON.parse(sessionStorage.getItem("test4"))["user_input_2"] || ``
          );
          setUser_input_question_3(
            JSON.parse(sessionStorage.getItem("test4"))["user_input_3"] || ``
          );

          setLanguage_id(
            JSON.parse(sessionStorage.getItem("test4"))[
              "language_Id_question_1"
            ] || 54
          );
          setLanguage_id_question_1(
            JSON.parse(sessionStorage.getItem("test4"))[
              "language_Id_question_1"
            ] || 54
          );
          setLanguage_id_question_2(
            JSON.parse(sessionStorage.getItem("test4"))[
              "language_Id_question_2"
            ] || 54
          );
          setLanguage_id_question_3(
            JSON.parse(sessionStorage.getItem("test4"))[
              "language_Id_question_3"
            ] || 54
          );
        }
      }
    }
    return () => {
      window.removeEventListener("contextmenu", contextm);
      window.removeEventListener("fullscreenchange", fullscreenc);
      activityDetector.stop();
      window.onkeydown = null
    };
  }, []);
  function converttime(timex) {
    let secs = 0;
    let x = timex.split(":");
    secs = secs + parseInt(x[0]) * 3600 + parseInt(x[1]) * 60 + parseInt(x[2]);
    return secs;
  }

  function inputCodeToLocal() {
    //below func to get value from ace editor
    let inputCode = $(".ace_layer .ace_line");
    let code = "";
    for (let x = 0; x < inputCode.length; x++) {
      code += inputCode[x].innerText;
      if (inputCode.length - 1 !== x) {
        code += "\n";
      }
    }
    setInput(code);
    let test = JSON.parse(sessionStorage.getItem("test4"));
    test[`input_${current_qs}`] = code;
    sessionStorage.setItem("test4", JSON.stringify(test));
    current_qs === 1
      ? setInput_question_1(code)
      : current_qs === 2
      ? setInput_question_2(code)
      : setInput_question_3(code);
    return code;
  }

  function userInput(event) {
    event.preventDefault();
    !event.target.value ? setUser_input() : setUser_input(event.target.value);

    current_qs === 1
      ? setUser_input_question_1(event.target.value)
      : current_qs === 2
      ? setUser_input_question_2(event.target.value)
      : setUser_input_question_3(event.target.value);

    let test = JSON.parse(sessionStorage.getItem("test4"));
    test[`user_input_${current_qs}`] = event.target.value;
    sessionStorage.setItem("test4", JSON.stringify(test));
  }

  function language(event) {
    event.preventDefault();
    setLanguage_id(event.target.value);
    set_render_state(true);
    current_qs === 1
      ? setLanguage_id_question_1(event.target.value)
      : current_qs === 2
      ? setLanguage_id_question_2(event.target.value)
      : setLanguage_id_question_3(event.target.value);

    let test = JSON.parse(sessionStorage.getItem("test4"));
    test[`language_Id_question_${current_qs}`] = event.target.value;

    sessionStorage.setItem("test4", JSON.stringify(test));
  }

  async function submit(e) {
    //below function to set to sessionStorage
    let code = inputCodeToLocal();

    if (current_qs === 1) {
      set_q1_testCase_Current_output("");
    } else if (current_qs === 2) {
      set_q2_testCase_Current_output("");
    } else if (current_qs === 3) {
      set_q3_testCase_Current_output("");
    }
    e.preventDefault();
    if (code !== "") {
      if (customInputCheck && (user_input === undefined || user_input === "")) {
        setDangerMsg("Please enter your input");
      } else {
        if (current_qs === 1) {
          set_q1_run_output("Creating Submission ...\n");
        } else if (current_qs === 2) {
          set_q2_run_output("Creating Submission ...\n");
        } else if (current_qs === 3) {
          set_q3_run_output("Creating Submission ...\n");
        }
        let response;
        let count = 0;
        let keyArr = process.env.REACT_APP_COMPILER_API_KEYS.split(",");
        let selectedKey;
        do {
          try {
            response = await fetch(
              "https://judge0-ce.p.rapidapi.com/submissions",
              {
                method: "POST",
                headers: {
                  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                  "x-rapidapi-key": `${keyArr[count]}`, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
                  "content-type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify({
                  source_code: code,
                  stdin: customInputCheck ? user_input : null, //stateVarialble
                  language_id: language_id,
                }),
              }
            );
            selectedKey = keyArr[count];
            count += 1;
          } catch (e) {
            console.log(e);
          }
        } while (parseInt(response.status) !== 201 && keyArr.length > count);
        if (response.status === 201) {
          if (current_qs === 1) {
            set_q1_run_output(q1_run_output + "Submission Created ...\n");
          } else if (current_qs === 2) {
            set_q2_run_output(q2_run_output + "Submission Created ...\n");
          } else if (current_qs === 3) {
            set_q3_run_output(q2_run_output + "Submission Created ...\n");
          }
          const jsonResponse = await response.json();
          let jsonGetSolution = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
          };
          let flag = false;
          while (flag !== true) {
            if (current_qs === 1) {
              set_q1_run_output(
                `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`
              );
            } else if (current_qs === 2) {
              set_q2_run_output(
                `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`
              );
            } else if (current_qs === 3) {
              set_q3_run_output(
                `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`
              );
            }
            if (jsonResponse.token) {
              let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
              const getSolution = await fetch(url, {
                method: "GET",
                headers: {
                  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                  "x-rapidapi-key": `${selectedKey}`, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
                  "content-type": "application/json",
                },
              });
              jsonGetSolution = await getSolution.json();
              if (
                jsonGetSolution.status.description === "Accepted" &&
                jsonGetSolution.stderr === null &&
                jsonGetSolution.compile_output === null
              ) {
                flag = true;
              } else if (
                jsonGetSolution.stderr !== null &&
                jsonGetSolution.status.description !== "Accepted"
              ) {
                flag = true;
              } else if (
                jsonGetSolution.stderr === null &&
                jsonGetSolution.status.description === "Compilation Error"
              ) {
                flag = true;
              } else if (
                jsonGetSolution.compile_output !== null &&
                jsonGetSolution.status.description === "Accepted"
              ) {
                flag = true;
              }
            }
          }
          if (
            jsonGetSolution.stdout &&
            jsonGetSolution.stderr === null &&
            jsonGetSolution.compile_output === null
          ) {
            var b = new Buffer(jsonGetSolution.stdout, "base64");
            const output = b.toString();
            if (current_qs === 1) {
              set_q1_testCase_Current_output(
                `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              set_q1_run_output(
                `${output}\n\nExxecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_1`] = JSON.stringify({
                run_output: `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`,
                q1_testCase_1_output: q1_testCase_1_output,
                q1_testCase_2_output: q1_testCase_2_output,
                q1_testCase_3_output: q1_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 2) {
              set_q2_testCase_Current_output(
                `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              set_q2_run_output(
                `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_2`] = JSON.stringify({
                run_output: `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`,
                q2_testCase_1_output: q2_testCase_1_output,
                q2_testCase_2_output: q2_testCase_2_output,
                q2_testCase_3_output: q2_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 3) {
              set_q3_testCase_Current_output(
                `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              set_q3_run_output(
                `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
              );
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_3`] = JSON.stringify({
                run_output: `${output}\n\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`,
                q3_testCase_1_output: q3_testCase_1_output,
                q3_testCase_2_output: q3_testCase_2_output,
                q3_testCase_3_output: q3_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            }
          } else if (jsonGetSolution.stderr) {
            var b = new Buffer(jsonGetSolution.stderr, "base64");
            const error = b.toString();
            if (current_qs === 1) {
              set_q1_testCase_Current_output(`Error :${error}`);
              set_q1_run_output(`Error :${error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_1`] = JSON.stringify({
                run_output: `Error :${error}`,
                q1_testCase_1_output: q1_testCase_1_output,
                q1_testCase_2_output: q1_testCase_2_output,
                q1_testCase_3_output: q1_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 2) {
              set_q2_testCase_Current_output(`\n Error :${error}`);
              set_q2_run_output(`\n Error :${error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_2`] = JSON.stringify({
                run_output: `\n Error :${error}`,
                q2_testCase_1_output: q2_testCase_1_output,
                q2_testCase_2_output: q2_testCase_2_output,
                q2_testCase_3_output: q2_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 3) {
              set_q3_testCase_Current_output(`\n Error :${error}`);
              set_q3_run_output(`\n Error :${error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_3`] = JSON.stringify({
                run_output: `\n Error :${error}`,
                q3_testCase_1_output: q3_testCase_1_output,
                q3_testCase_2_output: q3_testCase_2_output,
                q3_testCase_3_output: q3_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            }
          } else {
            var b = new Buffer(jsonGetSolution.compile_output, "base64");
            const compilation_error = b.toString();
            if (current_qs === 1) {
              set_q1_testCase_Current_output(`\n Error :${compilation_error}`);
              set_q1_run_output(`\n Error :${compilation_error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_1`] = JSON.stringify({
                run_output: `\n Error :${compilation_error}`,
                q1_testCase_1_output: q1_testCase_1_output,
                q1_testCase_2_output: q1_testCase_2_output,
                q1_testCase_3_output: q1_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 2) {
              set_q2_testCase_Current_output(`\n Error :${compilation_error}`);
              set_q2_run_output(`\n Error :${compilation_error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              test[`question_2`] = JSON.stringify({
                run_output: `\n Error :${compilation_error}`,
                q2_testCase_1_output: q2_testCase_1_output,
                q2_testCase_2_output: q2_testCase_2_output,
                q2_testCase_3_output: q2_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            } else if (current_qs === 3) {
              set_q3_testCase_Current_output(`\n Error :${compilation_error}`);
              set_q3_run_output(`\n Error :${compilation_error}`);
              let test = JSON.parse(sessionStorage.getItem("test4"));
              JSON.stringify({
                run_output: `\n Error :${compilation_error}`,
                q3_testCase_1_output: q3_testCase_1_output,
                q3_testCase_2_output: q3_testCase_2_output,
                q3_testCase_3_output: q3_testCase_3_output,
              });
              sessionStorage.setItem("test4", JSON.stringify(test));
            }
          }
        } else {
          setIsAlertDangerMsgLoaded(true);
          setDangerMsg("Something went wrong. Please contact administartor");
        }
      }
    }
  }

  async function submitCode(e) {
    //below function to set to sessionStorage
    let code = inputCodeToLocal();
    if (current_qs === 1) {
      set_submitCode_qs1(true);
      setIsSubmitCode_qs1(true);
      set_q1_testCase_1_output_error();
      set_q1_testCase_2_output_error();
      set_q1_testCase_3_output_error();
    } else if (current_qs === 2) {
      set_submitCode_qs2(true);
      setIsSubmitCode_qs2(true);
      set_q2_testCase_1_output_error();
      set_q2_testCase_2_output_error();
      set_q2_testCase_3_output_error();
    } else if (current_qs === 3) {
      set_submitCode_qs3(true);
      setIsSubmitCode_qs3(true);
      set_q3_testCase_1_output_error();
      set_q3_testCase_2_output_error();
      set_q3_testCase_3_output_error();
    }
    e.preventDefault();
    if (code) {
      if (current_qs === 1) {
        set_q1_testCase_Current_output("Creating Submission ...\n");
      } else if (current_qs === 2) {
        set_q2_testCase_Current_output("Creating Submission ...\n");
      } else if (current_qs === 3) {
        set_q3_testCase_Current_output("Creating Submission ...\n");
      }
      let count = 0;
      let keyArr = process.env.REACT_APP_COMPILER_API_KEYS.split(","),
        selectedKey;
      let jsonResponse;
      do {
        selectedKey = keyArr[count];
        const response = await fetch(
          "https://judge0-ce.p.rapidapi.com/submissions/batch",
          {
            method: "POST",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": `${selectedKey}`, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
              "content-type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              submissions: [
                {
                  source_code: code,
                  stdin:
                    current_qs === 1
                      ? q1_testCase_1_input
                      : current_qs === 2
                      ? q2_testCase_1_input
                      : q3_testCase_1_input, //stateVarialble
                  language_id: language_id,
                  expected_output:
                    current_qs === 1
                      ? q1_testCase_1_expected_output
                      : current_qs === 2
                      ? q2_testCase_1_expected_output
                      : q3_testCase_1_expected_output, //stateVarialble
                },
                {
                  source_code: code,
                  stdin:
                    current_qs === 1
                      ? q1_testCase_2_input
                      : current_qs === 2
                      ? q2_testCase_2_input
                      : q3_testCase_2_input, //stateVarialble
                  language_id: language_id,
                  expected_output:
                    current_qs === 1
                      ? q1_testCase_2_expected_output
                      : current_qs === 2
                      ? q2_testCase_2_expected_output
                      : q3_testCase_2_expected_output, //stateVarialble
                },
                {
                  source_code: code,
                  stdin:
                    current_qs === 1
                      ? q1_testCase_3_input
                      : current_qs === 2
                      ? q2_testCase_3_input
                      : q3_testCase_3_input, //stateVarialble
                  language_id: language_id,
                  expected_output:
                    current_qs === 1
                      ? q1_testCase_3_expected_output
                      : current_qs === 2
                      ? q2_testCase_3_expected_output
                      : q3_testCase_3_expected_output, //stateVarialble
                },
              ],
            }),
          }
        );
        jsonResponse = await response.json();
        count += 1;
      } while (
        jsonResponse.message !== undefined &&
        jsonResponse.message ===
          "You have exceeded the DAILY quota for Batched Submissions on your current plan, BASIC. Upgrade your plan at https://rapidapi.com/judge0-official/api/judge0-ce"
      );
      if (current_qs === 1) {
        set_q1_testCase_Current_output(
          q1_testCase_Current_output + "Submission Created ...\n"
        );
      } else if (current_qs === 2) {
        set_q2_testCase_Current_output(
          q2_testCase_Current_output + "Submission Created ...\n"
        );
      } else if (current_qs === 3) {
        set_q3_testCase_Current_output(
          q3_testCase_Current_output + "Submission Created ...\n"
        );
      }
      let jsonGetSolution = {
        submissions: [
          {
            status: { description: "In Queue" },
            stderr: null,
            compile_output: null,
          },
          {
            status: { description: "In Queue" },
            stderr: null,
            compile_output: null,
          },
          {
            status: { description: "In Queue" },
            stderr: null,
            compile_output: null,
          },
        ],
      };
      let flag = false;
      while (flag !== true) {
        if (current_qs === 1) {
          set_q1_testCase_Current_output(
            `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.submissions[0].status.description}`
          );
        } else if (current_qs === 2) {
          set_q2_testCase_Current_output(
            `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.submissions[0].status.description}`
          );
        } else if (current_qs === 3) {
          set_q3_testCase_Current_output(
            `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.submissions[0].status.description}`
          );
        }
        if (
          jsonResponse[0].token &&
          jsonResponse[1].token &&
          jsonResponse[2].token
        ) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${jsonResponse[0].token},${jsonResponse[1].token},${jsonResponse[2].token}&base64_encoded=true&wait=true`;
          const getSolution = await fetch(url, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": `${selectedKey}`, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
              "content-type": "application/json",
            },
          });
          jsonGetSolution = await getSolution.json();
          if (
            (jsonGetSolution.submissions[0].status.description === "Accepted" ||
              jsonGetSolution.submissions[0].status.id === 4) &&
            jsonGetSolution.submissions[0].stderr === null &&
            jsonGetSolution.submissions[0].compile_output === null &&
            (jsonGetSolution.submissions[1].status.description === "Accepted" ||
              jsonGetSolution.submissions[1].status.id === 4) &&
            jsonGetSolution.submissions[1].stderr === null &&
            jsonGetSolution.submissions[1].compile_output === null &&
            (jsonGetSolution.submissions[2].status.description === "Accepted" ||
              jsonGetSolution.submissions[2].status.id === 4) &&
            jsonGetSolution.submissions[2].stderr === null &&
            jsonGetSolution.submissions[2].compile_output === null
          ) {
            flag = true;
          } else if (
            jsonGetSolution.submissions[1].status.description !== "In Queue" &&
            jsonGetSolution.submissions[1].status.description !==
              "Processing" &&
            jsonGetSolution.submissions[2].status.description !== "In Queue" &&
            jsonGetSolution.submissions[2].status.description !==
              "Processing" &&
            jsonGetSolution.submissions[0].status.description !== "In Queue" &&
            jsonGetSolution.submissions[0].status.description !==
              "Processing" &&
            (jsonGetSolution.submissions[1].stderr !== null ||
              jsonGetSolution.submissions[2].stderr !== null ||
              jsonGetSolution.submissions[0].stderr !== null)
          ) {
            flag = true;
          } else if (
            ((jsonGetSolution.submissions[1].status.description ===
              "Compilation Error" &&
              jsonGetSolution.submissions[1].stderr === null) ||
              (jsonGetSolution.submissions[0].status.description ===
                "Compilation Error" &&
                jsonGetSolution.submissions[0].stderr === null) ||
              (jsonGetSolution.submissions[2].status.description ===
                "Compilation Error" &&
                jsonGetSolution.submissions[2].stderr === null)) &&
            jsonGetSolution.submissions[1].status.description !== "In Queue" &&
            jsonGetSolution.submissions[1].status.description !==
              "Processing" &&
            jsonGetSolution.submissions[2].status.description !== "In Queue" &&
            jsonGetSolution.submissions[2].status.description !==
              "Processing" &&
            jsonGetSolution.submissions[0].status.description !== "In Queue" &&
            jsonGetSolution.submissions[0].status.description !== "Processing"
          ) {
            flag = true;
          } else if (
            (jsonGetSolution.submissions[0].status.description === "Accepted" ||
              jsonGetSolution.submissions[0].status.id === 4) &&
            jsonGetSolution.submissions[0].stderr === null &&
            jsonGetSolution.submissions[0].compile_output !== null &&
            (jsonGetSolution.submissions[1].status.description === "Accepted" ||
              jsonGetSolution.submissions[1].status.id === 4) &&
            jsonGetSolution.submissions[1].stderr === null &&
            jsonGetSolution.submissions[1].compile_output !== null &&
            (jsonGetSolution.submissions[2].status.description === "Accepted" ||
              jsonGetSolution.submissions[2].status.id === 4) &&
            jsonGetSolution.submissions[2].stderr === null &&
            jsonGetSolution.submissions[2].compile_output !== null
          ) {
            flag = true;
          }
        } else {
          setIsAlertDangerMsgLoaded(true);
          setDangerMsg("Error Occured. Token doesn't exist");
          break;
        }
      }
      if (flag) {
        let t1Output, t2Output, t3Output;
        for (var y = 0; y < jsonGetSolution.submissions.length; y++) {
          if (
            jsonGetSolution.submissions[y].stdout &&
            jsonGetSolution.submissions[y].stderr === null &&
            jsonGetSolution.submissions[y].compile_output === null
          ) {
            var b = new Buffer(jsonGetSolution.submissions[y].stdout, "base64");
            const output = b.toString();

            if (jsonGetSolution.submissions[y].status.id === 3) {
              if (current_qs === 1) {
                if (y === 0) {
                  set_q1_testCase_1_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;

                  set_q1_testCase_1_output_error(false);
                  set_q1_testCase_Current_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q1_testCase_2_output_error(false);
                  set_q1_testCase_2_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q1_testCase_3_output_error(false);
                  set_q1_testCase_3_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              } else if (current_qs == 2) {
                if (y === 0) {
                  set_q2_testCase_1_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;

                  set_q2_testCase_1_output_error(false);
                  set_q2_testCase_Current_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q2_testCase_2_output_error(false);
                  set_q2_testCase_2_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q2_testCase_3_output_error(false);
                  set_q2_testCase_3_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              } else if (current_qs == 3) {
                if (y === 0) {
                  set_q3_testCase_1_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;

                  set_q3_testCase_1_output_error(false);
                  set_q3_testCase_Current_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q3_testCase_2_output_error(false);
                  set_q3_testCase_2_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q3_testCase_3_output_error(false);
                  set_q3_testCase_3_output(
                    `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              }
            } else if (jsonGetSolution.submissions[y].status.id === 4) {
              if (current_qs === 1) {
                if (y === 0) {
                  set_q1_testCase_1_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_1_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;

                  set_q1_testCase_1_output_error(true);
                  set_q1_testCase_Current_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q1_testCase_2_output_error(true);
                  set_q1_testCase_2_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_2_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_2_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q1_testCase_3_output_error(true);
                  set_q1_testCase_3_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_3_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q1_testCase_3_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              } else if (current_qs == 2) {
                if (y === 0) {
                  set_q2_testCase_1_output_error(true);
                  set_q2_testCase_1_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_1_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                  set_q2_testCase_Current_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q2_testCase_2_output_error(true);
                  set_q2_testCase_2_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_2_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_2_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q2_testCase_3_output_error(true);
                  set_q2_testCase_3_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_3_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q2_testCase_2_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              } else if (current_qs == 3) {
                if (y === 0) {
                  set_q3_testCase_1_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t1Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_1_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;

                  set_q3_testCase_1_output_error(true);
                  set_q3_testCase_Current_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_1_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                } else if (y === 1) {
                  set_q3_testCase_2_output_error(true);
                  set_q3_testCase_2_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_2_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t2Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_2_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                } else if (y === 2) {
                  set_q3_testCase_3_output_error(true);
                  set_q3_testCase_3_output(
                    `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_3_expected_output}
              \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
                  );
                  t3Output = `Wrong Answer\nYour Output:\n${output}\nExpected Output:\n${q3_testCase_3_expected_output}
            \nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`;
                }
              }
            }
          } else if (jsonGetSolution.submissions[y].stderr) {
            var b = new Buffer(jsonGetSolution.submissions[y].stderr, "base64");
            const error = b.toString();
            if (current_qs === 1) {
              if (y === 0) {
                set_q1_testCase_1_output(`Error :${error}`);
                set_q1_testCase_Current_output(`Error :${error}`);
                set_q1_testCase_1_output_error(true);
                t1Output = `Error :${error}`;
              } else if (y === 1) {
                set_q1_testCase_2_output(`Error :${error}`);
                t2Output = `Error :${error}`;
                set_q1_testCase_2_output_error(true);
              } else if (y == 2) {
                set_q1_testCase_3_output(`Error :${error}`);
                t3Output = `Error :${error}`;
                set_q1_testCase_3_output_error(true);
              }
            } else if (current_qs === 2) {
              if (y === 0) {
                set_q2_testCase_1_output(`Error :${error}`);
                set_q2_testCase_Current_output(`Error :${error}`);
                set_q2_testCase_1_output_error(true);
                t1Output = `Error :${error}`;
              } else if (y === 1) {
                set_q2_testCase_2_output(`Error :${error}`);
                t2Output = `Error :${error}`;
                set_q2_testCase_2_output_error(true);
              } else if (y == 2) {
                set_q2_testCase_3_output(`Error :${error}`);
                t3Output = `Error :${error}`;
                set_q2_testCase_3_output_error(true);
              }
            } else if (current_qs === 3) {
              if (y === 0) {
                set_q3_testCase_1_output(`Error :${error}`);
                set_q3_testCase_Current_output(`Error :${error}`);
                set_q3_testCase_1_output_error(true);
                t1Output = `Error :${error}`;
              } else if (y === 1) {
                set_q3_testCase_2_output(`Error :${error}`);
                t2Output = `Error :${error}`;
                set_q3_testCase_2_output_error(true);
              } else if (y == 2) {
                set_q3_testCase_3_output(`Error :${error}`);
                t3Output = `Error :${error}`;
                set_q3_testCase_3_output_error(true);
              }
            }
          } else {
            var b = new Buffer(
              jsonGetSolution.submissions[y].compile_output,
              "base64"
            );
            const compilation_error = b.toString();
            if (current_qs === 1) {
              if (y === 0) {
                set_q1_testCase_1_output(`Error :${compilation_error}`);
                set_q1_testCase_1_output_error(true);
                set_q1_testCase_Current_output(`Error :${compilation_error}`);
                t1Output = `Error :${compilation_error}`;
              } else if (y === 1) {
                set_q1_testCase_2_output_error(true);
                set_q1_testCase_2_output(`Error :${compilation_error}`);
                t2Output = `Error :${compilation_error}`;
              } else if (y === 2) {
                set_q1_testCase_3_output_error(true);
                set_q1_testCase_3_output(`Error :${compilation_error}`);
                t3Output = `Error :${compilation_error}`;
              }
            } else if (current_qs === 2) {
              if (y === 0) {
                set_q2_testCase_1_output(`Error :${compilation_error}`);
                set_q2_testCase_1_output_error(true);
                set_q2_testCase_Current_output(`Error :${compilation_error}`);
                t1Output = `Error :${compilation_error}`;
              } else if (y === 1) {
                set_q2_testCase_2_output_error(true);
                set_q2_testCase_2_output(`Error :${compilation_error}`);
                t2Output = `Error :${compilation_error}`;
              } else if (y === 2) {
                set_q2_testCase_3_output_error(true);
                set_q2_testCase_3_output(`Error :${compilation_error}`);
                t3Output = `Error :${compilation_error}`;
              }
            } else if (current_qs === 3) {
              if (y === 0) {
                set_q3_testCase_1_output(`Error :${compilation_error}`);
                set_q3_testCase_1_output_error(true);
                set_q3_testCase_Current_output(`Error :${compilation_error}`);
                t1Output = `Error :${compilation_error}`;
              } else if (y === 1) {
                set_q3_testCase_2_output_error(true);
                set_q3_testCase_2_output(`Error :${compilation_error}`);
                t2Output = `Error :${compilation_error}`;
              } else if (y === 2) {
                set_q3_testCase_3_output_error(true);
                set_q3_testCase_3_output(`Error :${compilation_error}`);
                t3Output = `Error :${compilation_error}`;
              }
            }
          }
        }
        if (current_qs === 1) {
          let test = JSON.parse(sessionStorage.getItem("test4"));
          test[`question_1`] = JSON.stringify({
            run_output: q1_run_output,
            q1_testCase_1_output: t1Output,
            q1_testCase_2_output: t2Output,
            q1_testCase_3_output: t3Output,
          });

          sessionStorage.setItem("test4", JSON.stringify(test));
        } else if (current_qs === 2) {
          let test = JSON.parse(sessionStorage.getItem("test4"));
          test[`question_2`] = JSON.stringify({
            run_output: q2_run_output,
            q2_testCase_1_output: t1Output,
            q2_testCase_2_output: t2Output,
            q2_testCase_3_output: t3Output,
          });

          sessionStorage.setItem("test4", JSON.stringify(test));
        } else if (current_qs === 3) {
          let test = JSON.parse(sessionStorage.getItem("test4"));
          test[`question_3`] = JSON.stringify({
            run_output: q3_run_output,
            q3_testCase_1_output: t1Output,
            q3_testCase_2_output: t2Output,
            q3_testCase_3_output: t3Output,
          });

          sessionStorage.setItem("test4", JSON.stringify(test));
        }
      } else {
        setIsAlertDangerMsgLoaded(true);
        setDangerMsg("Please contact the admin");
      }
    }
  }

  $(document).ready(function () {
    "use strict";
    let eleQ1 = document.getElementById("uncontrolled-tab-example-tab-Q1");
    if (eleQ1) {
      if (submitCode_qs1) {
        if (
          q1_testCase_1_output_error !== undefined &&
          q1_testCase_2_output_error !== undefined &&
          q1_testCase_3_output_error !== undefined
        ) {
          if (
            !q1_testCase_1_output_error &&
            !q1_testCase_2_output_error &&
            !q1_testCase_3_output_error
          ) {
            eleQ1.style.backgroundColor = "#10b65c"; //green
            eleQ1.style.color = "white";
          } else {
            eleQ1.style.backgroundColor = "#dc3545"; //red
            eleQ1.style.color = "white";
          }
        } else {
          eleQ1.style.backgroundColor = "#6c757d"; //grey
          eleQ1.style.color = "white";
        }
      }
    }
    if (submitCode_qs2) {
      let eleQ2 = document.getElementById("uncontrolled-tab-example-tab-Q2");
      if (eleQ2) {
        if (
          q2_testCase_1_output_error !== undefined &&
          q2_testCase_2_output_error !== undefined &&
          q2_testCase_3_output_error !== undefined
        ) {
          if (
            !q2_testCase_1_output_error &&
            !q2_testCase_2_output_error &&
            !q2_testCase_3_output_error
          ) {
            eleQ2.style.backgroundColor = "#10b65c";
            eleQ2.style.color = "white";
          } else {
            eleQ2.style.backgroundColor = "#dc3545";
            eleQ2.style.color = "white";
          }
        } else {
          eleQ2.style.backgroundColor = "#6c757d"; //grey
          eleQ2.style.color = "white";
        }
      }
    }
    if (submitCode_qs3) {
      let eleQ3 = document.getElementById("uncontrolled-tab-example-tab-Q3");
      if (eleQ3) {
        if (
          q3_testCase_1_output_error !== undefined &&
          q3_testCase_2_output_error !== undefined &&
          q3_testCase_3_output_error !== undefined
        ) {
          if (
            !q3_testCase_1_output_error &&
            !q3_testCase_2_output_error &&
            !q3_testCase_3_output_error
          ) {
            eleQ3.style.backgroundColor = "#10b65c";
            eleQ3.style.color = "white";
          } else {
            eleQ3.style.backgroundColor = "#dc3545";
            eleQ3.style.color = "white";
          }
        } else {
          eleQ3.style.backgroundColor = "#6c757d"; //grey
          eleQ3.style.color = "white";
        }
      }
    }
    let sum = 0;
    let sum1 = 0;
    let sum2 = 0;
    let sum3 = 0;

    if (q1_testCase_1_output_error === false) {
      sum1 = sum1 + 2;
      sum = sum + 2;
    }
    if (q1_testCase_2_output_error === false) {
      sum1 = sum1 + 3;
      sum = sum + 3;
    }
    if (q1_testCase_3_output_error === false) {
      sum1 = sum1 + 5;
      sum = sum + 5;
    }

    if (q2_testCase_1_output_error === false) {
      sum2 = sum2 + 4;
      sum = sum + 4;
    }
    if (q2_testCase_2_output_error === false) {
      sum2 = sum2 + 5;
      sum = sum + 5;
    }
    if (q2_testCase_3_output_error === false) {
      sum2 = sum2 + 10;
      sum = sum + 10;
    }

    if (q3_testCase_1_output_error === false) {
      sum3 = sum3 + 5;
      sum = sum + 5;
    }
    if (q3_testCase_2_output_error === false) {
      sum3 = sum3 + 10;
      sum = sum + 10;
    }
    if (q3_testCase_3_output_error === false) {
      sum3 = sum3 + 15;
      sum = sum + 15;
    }
    let ax = JSON.parse(sessionStorage.getItem("test4"));
    if (ax !== undefined && isValidPath) {
      ax["total_q_marks"] = sum;
      ax["q1_marks"] = sum1;
      ax["q2_marks"] = sum2;
      ax["q3_marks"] = sum3;
      ax["marks"] = [sum1, sum2, sum3];
      sessionStorage.setItem("test4", JSON.stringify(ax));
    }
  });

  function GoInFullscreen(element) {
    if (document.fullscreenElement === null) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
      element.style.overflowY = `auto`;
      element.classList.add(`style-4`);
    }
  }

  function handleCloseSChange(e) {
    setCountWindowAwayModal(false);
    GoInFullscreen(document.querySelector("#element"));
  }
  function windowAway() {
    var ccount = parseInt(sessionStorage.getItem("screenchange"));
    setCountWindowAway(ccount + 1);
    if (ccount + 1 < 3) {
      sessionStorage.setItem("screenchange", ccount + 1);
      setCountWindowAwayModal(true);
    } else {
      navigate("/result");
    }
  }

  return (
    <>
      {isDesktopOrLaptop ? (
        <>
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
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              <Modal.Title>Enter FullScreeen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {reload ? (
                <CustomTimer
                  msg={`Please Enter Full Screen or Test will get auto submitted in`}
                  onlyS={true}
                  reset={md}
                  time={10}
                  start={show}
                  setMd={setMd}
                  nextpage={"result"}
                ></CustomTimer>
              ) : (
                "Please enter Full Screen mode"
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={(e) => {
                  handleClose(e);
                  GoInFullscreen(document.querySelector("#element"));
                }}
              >
                Enter Full Screeen
              </Button>
            </Modal.Footer>
          </Modal>
          {countWindowAwayModal && (
            <>
              <div
                style={{
                  backgroundColor: "#F8D7DA",
                  height: "fit-content",
                  width: "95%",
                  border: "1px #8A3C5B",
                  borderRadius: "8px",
                  textAlign: "center",
                  margin: "10px 10px 10px 25px",
                }}
              >
                <AiFillWarning
                  style={{
                    height: "30px",
                    width: "30px",
                    textAlign: "center",
                    margin: "20px 0",
                    color: "#842029",
                  }}
                />
                <p
                  style={{
                    color: "#842029",
                    textAlign: "center",
                  }}
                >
                  <b>{countWindowAway === 1 ? "1st" : "Last"} Warning</b>
                </p>
                <p
                  style={{
                    color: "#842029",
                    fontWeight: "normal",
                    fontSize: "14px",
                    margin: "0 10px 10px 10px",
                    textAlign: "center",
                  }}
                >
                  The screen has been changed.Test will get auto submitted if
                  you try to change screen again{" "}
                </p>
                <Button
                  onClick={(e) => handleCloseSChange(e)}
                  style={{
                    backgroundColor: "#842029",
                    margin: "10px 0",
                    color: "white",
                    outline: "none",
                    border: "none",
                  }}
                >
                  Continue
                </Button>
              </div>
            </>
          )}
          <Row>
            <Col md={12}>
              <Row>
                <Col md={6} style={{ paddingLeft: "0px" }}>
                  <div
                    className="TestHeaderComp"
                    style={{ paddingBottom: "7px", height: "50px" }}
                  >
                    {timeFF !== undefined && (
                      <TestHeaderComp
                        noTotal={true}
                        timer={timeFF}
                        start={!testFinshBool}
                        reset={testFinshBool}
                        timeKey="Time"
                        header="Coding"
                        nextpage={"domain"}
                        setMd={setMd}
                      ></TestHeaderComp>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <Row
                    style={{
                      height: nextSecConfirmation ? "auto" : "40px",
                      marginTop: "5px",
                      marginBottom: "10px",
                      width: "100%",
                    }}
                  >
                    <Col md={nextSecConfirmation ? 12 : 4}>
                      {nextSecConfirmation && (
                        <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                          Are you sure you want to go to the next section? You
                          cannot come to this section again!
                        </p>
                      )}
                    </Col>
                    <Col md={nextSecConfirmation ? 4 : 4}>
                      {!nextSecConfirmation ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            setNextSecConfirmation(true);
                          }}
                          style={{
                            color: "white",
                            borderRadius: "10px",
                            width: "125px",
                            padding: "7px 10px",
                          }}
                          className="btn scTest"
                        >
                          Next Section
                        </button>
                      ) : (
                        <>
                          <Row>
                            <Col lg={6}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  setMd(true);
                                  setTestFinishBool(true);
                                  setShow(false);
                                  navigate("/domain");
                                }}
                                style={{
                                  color: "white",
                                  backgroundColor: "#10b65c",
                                  borderRadius: "10px",
                                  width: "100%",
                                  padding: "7px 10px",
                                }}
                                className="btn"
                              >
                                Yes
                              </button>
                            </Col>
                            <Col lg={6}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  setNextSecConfirmation(false);
                                }}
                                style={{
                                  color: "white",
                                  backgroundColor: "red",
                                  borderRadius: "10px",
                                  padding: "7px 10px",
                                  width: "100%",
                                }}
                                className="btn"
                              >
                                No
                              </button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Col>
                    <Col md={nextSecConfirmation ? 6 : 4}>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={(e) => {
                          setTestFinishBool(true);
                          setShow(false);
                          setMd(true);
                          navigate("/result");
                          if (document.exitFullscreen) {
                            document.exitFullscreen();
                          } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                          } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                          } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                          }
                        }}
                        style={{
                          backgroundColor: "#081466",
                          width: "120px",
                          borderRadius: "10px",
                          color: "white",
                          padding: "7px 10px",
                          height: "40px",
                        }}
                      >
                        Finish Test
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <div
                  className="basicRec"
                  style={{
                    marginTop: "5px",
                    height: window.screen.height - 300,
                    backgroundColor: "#F7F7F7",
                  }}
                >
                  <Tabs
                    defaultActiveKey="Q1"
                    inkBarStyle={{ background: "blue" }}
                    id="uncontrolled-tab-example"
                    style={{ marginBottom: "0px !important" }}
                    className="mb-3"
                    onClick={(e) => {
                      let qsNo = e.target.textContent.split("Q")[1];
                      set_current_qs(parseInt(qsNo));
                      if (parseInt(qsNo) === 1) {
                        set_question_current(question_1);
                        setInput(inputT_question_1);
                        document.getElementById("editor").value =
                          inputT_question_1;
                        document.getElementsByClassName(
                          "customInput"
                        )[0].value = user_input_question_1;
                        setUser_input(user_input_question_1);
                        setLanguage_id(language_id_question_1);
                        set_render_state(true);
                        if (
                          document.getElementsByClassName("codeOutput")[0] !==
                          undefined
                        ) {
                          if (isSubmitCode_qs1) {
                            document.getElementsByClassName(
                              "codeOutput"
                            )[0].value = q1_testCase_1_output;
                            set_q1_testCase_Current_output(
                              q1_testCase_1_output
                            );
                          } else {
                            if (q1_run_output !== undefined) {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = q1_run_output;
                              set_q1_testCase_Current_output(q1_run_output);
                            } else {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = "";
                              set_q1_testCase_Current_output();
                            }
                          }
                        }
                      } else if (parseInt(qsNo) === 2) {
                        set_question_current(question_2);
                        setInput(inputT_question_2);
                        document.getElementById("editor").value =
                          inputT_question_2;
                        document.getElementsByClassName(
                          "customInput"
                        )[0].value = user_input_question_2;
                        setUser_input(user_input_question_2);
                        setLanguage_id(language_id_question_2);
                        set_render_state(true);
                        if (
                          document.getElementsByClassName("codeOutput")[0] !==
                          undefined
                        ) {
                          if (isSubmitCode_qs2) {
                            document.getElementsByClassName(
                              "codeOutput"
                            )[0].value = q2_testCase_1_output;
                            set_q2_testCase_Current_output(
                              q2_testCase_1_output
                            );
                          } else {
                            if (q2_run_output !== undefined) {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = q2_run_output;
                              set_q2_testCase_Current_output(q2_run_output);
                            } else {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = "";
                              set_q2_testCase_Current_output();
                            }
                          }
                        }
                      } else if (parseInt(qsNo) === 3) {
                        set_question_current(question_3);
                        setInput(inputT_question_3);
                        document.getElementById("editor").value =
                          inputT_question_3;
                        document.getElementsByClassName(
                          "customInput"
                        )[0].value = user_input_question_3;
                        setUser_input(user_input_question_3);
                        setLanguage_id(language_id_question_3);
                        set_render_state(true);

                        if (
                          document.getElementsByClassName("codeOutput")[0] !==
                          undefined
                        ) {
                          if (isSubmitCode_qs3) {
                            document.getElementsByClassName(
                              "codeOutput"
                            )[0].value = q3_testCase_1_output;
                            set_q3_testCase_Current_output(
                              q3_testCase_1_output
                            );
                          } else {
                            if (q3_run_output !== undefined) {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = q3_run_output;
                              set_q3_testCase_Current_output(q3_run_output);
                            } else {
                              document.getElementsByClassName(
                                "codeOutput"
                              )[0].value = "";
                              set_q3_testCase_Current_output();
                            }
                          }
                        }
                      }
                    }}
                  >
                    <Tab eventKey="Q1" title="Q1">
                      <CodingQsComp qs={question_1}></CodingQsComp>
                    </Tab>
                    <Tab eventKey="Q2" title="Q2">
                      <CodingQsComp qs={question_2}></CodingQsComp>
                    </Tab>
                    <Tab eventKey="Q3" title="Q3">
                      <CodingQsComp qs={question_3}></CodingQsComp>
                    </Tab>
                  </Tabs>
                </div>
              </Row>
            </Col>
          </Row>
          <Row style={{ margin: "10px 0" }}>
            <Col>
              <Row
                style={{
                  paddingTop: "5px",
                  paddingBottom: "0",
                }}
              >
                <Col lg={1} style={{ paddingLeft: "0" }}>
                  <select
                    style={{ width: "80px" }}
                    value={language_id}
                    onChange={language}
                    id="tags"
                    className="form-control form-inline mb-2 language"
                  >
                    <option value="54">C++</option>
                    <option value="50">C</option>
                    <option value="62">Java</option>
                    <option value="71">Python</option>
                  </select>
                </Col>
                <Col lg={2} style={{ width: "200px" }}>
                  <div
                    className="custom-control custom-checkbox"
                    style={{ paddingTop: "8px" }}
                  >
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      style={{ margin: "0 4px" }}
                      onClick={(e) => {
                        console.log(e);
                        setCustomInputCheck(e.target.checked);
                      }}
                      id="defaultUnchecked"
                    />
                    <label
                      className="custom-control-label"
                      for="defaultUnchecked"
                    >
                      Custom Input
                    </label>
                  </div>
                </Col>
                <Col lg={2}>
                  <button
                    type="submit"
                    className="btn scTest ml-2 mr-2 "
                    style={{ color: "white", width: "80%" }}
                    onClick={(e) => {
                      current_qs === 1
                        ? setIsSubmitCode_qs1()
                        : current_qs === 2
                        ? setIsSubmitCode_qs2()
                        : setIsSubmitCode_qs3();
                      submit(e);
                    }}
                  >
                    <i className="fas fa-cog fa-fw"></i> Run
                  </button>
                </Col>
                <Col lg={2}>
                  <button
                    type="submit"
                    className="btn scTest ml-2 mr-2 "
                    style={{ color: "white", width: "80%", margin: "0" }}
                    onClick={(e) => {
                      if (current_qs === 1) {
                        set_submitCode_qs1(true);
                      } else if (current_qs === 2) {
                        set_submitCode_qs2(true);
                      } else if (current_qs === 3) {
                        set_submitCode_qs3(true);
                      }
                      submitCode(e);
                    }}
                  >
                    Submit
                  </button>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Row style={{ marginTop: "5px" }}>
                    <div
                      className="basicRec"
                      style={{
                        backgroundColor: "#F7F7F7",
                        padding: "5px 5px",
                        height: "450px",
                      }}
                    >
                      {current_qs === 1 &&
                        language_id_question_1 !== undefined && (
                          <ACEEditor
                            inputT={inputT_question_1}
                            render_state={render_state}
                            set_render_state={set_render_state}
                            language_id={language_id_question_1}
                            height="400px"
                          ></ACEEditor>
                        )}
                      {current_qs === 2 &&
                        language_id_question_2 !== undefined && (
                          <ACEEditor
                            inputT={inputT_question_2}
                            render_state={render_state}
                            set_render_state={set_render_state}
                            language_id={language_id_question_2}
                            height="400px"
                          ></ACEEditor>
                        )}
                      {current_qs === 3 &&
                        language_id_question_3 !== undefined && (
                          <ACEEditor
                            inputT={inputT_question_3}
                            render_state={render_state}
                            set_render_state={set_render_state}
                            language_id={language_id_question_3}
                            height="400px"
                          ></ACEEditor>
                        )}
                    </div>
                  </Row>
                </Col>
                <Col
                  className="basicRec"
                  style={{
                    margin: "5px 10px 0 10px",
                    height: "450px",
                    backgroundColor: "#F7F7F7",
                  }}
                >
                  <Tabs
                    defaultActiveKey="customInput"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="customInput" title="custom input">
                      <textarea
                        id="style-4"
                        className="scrollbar customInput"
                        spellCheck={false}
                        defaultValue={user_input}
                        style={{ height: "350px" }}
                        onChange={userInput}
                      ></textarea>
                    </Tab>
                    <Tab eventKey="Result" title="result">
                      <Row>
                        {(current_qs === 1
                          ? submitCode_qs1
                          : current_qs === 2
                          ? submitCode_qs2
                          : submitCode_qs3) && (
                          <Col md={3}>
                            <div>
                              <Row className="" style={{ height: "20%" }}>
                                {(
                                  current_qs === 1
                                    ? q1_testCase_1_output_error !== undefined
                                    : current_qs === 2
                                    ? q2_testCase_1_output_error !== undefined
                                    : q3_testCase_1_output_error !== undefined
                                ) ? (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className={
                                        current_qs === 1
                                          ? !q1_testCase_1_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : current_qs === 2
                                          ? !q2_testCase_1_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : !q3_testCase_1_output_error
                                          ? "btn scTest"
                                          : "btn btn-danger"
                                      }
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_1_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_1_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_1_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_1_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_1_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_1_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 1
                                    </button>
                                  </Col>
                                ) : (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_1_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_1_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_1_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_1_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_1_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_1_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 1
                                    </button>
                                  </Col>
                                )}
                              </Row>
                              <Row>
                                {(
                                  current_qs === 1
                                    ? q1_testCase_2_output_error !== undefined
                                    : current_qs === 2
                                    ? q2_testCase_2_output_error !== undefined
                                    : q3_testCase_2_output_error !== undefined
                                ) ? (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className={
                                        current_qs === 1
                                          ? !q1_testCase_2_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : current_qs === 2
                                          ? !q2_testCase_2_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : !q3_testCase_2_output_error
                                          ? "btn scTest"
                                          : "btn btn-danger"
                                      }
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_2_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_2_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_2_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_2_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_2_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_2_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 2
                                    </button>
                                  </Col>
                                ) : (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className="btn btn-secondary"
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_2_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_2_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_2_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_2_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_2_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_2_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 2
                                    </button>
                                  </Col>
                                )}
                              </Row>
                              <Row className="">
                                {(
                                  current_qs === 1
                                    ? q1_testCase_3_output_error !== undefined
                                    : current_qs === 2
                                    ? q2_testCase_3_output_error !== undefined
                                    : q3_testCase_3_output_error !== undefined
                                ) ? (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className={
                                        current_qs === 1
                                          ? !q1_testCase_3_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : current_qs === 2
                                          ? !q2_testCase_3_output_error
                                            ? "btn scTest"
                                            : "btn btn-danger"
                                          : !q3_testCase_3_output_error
                                          ? "btn scTest"
                                          : "btn btn-danger"
                                      }
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_3_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_3_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_3_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_3_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_3_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_3_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 3
                                    </button>
                                  </Col>
                                ) : (
                                  <Col style={{ paddingLeft: "0%" }}>
                                    <button
                                      className={"btn btn-secondary"}
                                      onClick={(e) => {
                                        if (current_qs === 1) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q1_testCase_3_output;
                                          set_q1_testCase_Current_output(
                                            q1_testCase_3_output
                                          );
                                        } else if (current_qs === 2) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q2_testCase_3_output;
                                          set_q2_testCase_Current_output(
                                            q2_testCase_3_output
                                          );
                                        } else if (current_qs === 3) {
                                          document.getElementsByClassName(
                                            "codeOutput"
                                          )[0].value = q3_testCase_3_output;
                                          set_q3_testCase_Current_output(
                                            q3_testCase_3_output
                                          );
                                        }
                                      }}
                                      style={{
                                        margin: "10px",
                                        color: "white",
                                        borderRadius: "0",
                                        width: "100%",
                                      }}
                                    >
                                      Test Case 3
                                    </button>
                                  </Col>
                                )}
                              </Row>
                            </div>
                          </Col>
                        )}
                        <Col
                          md={
                            (
                              current_qs === 1
                                ? submitCode_qs1
                                : current_qs === 2
                                ? submitCode_qs2
                                : submitCode_qs3
                            )
                              ? 9
                              : 12
                          }
                        >
                          <textarea
                            disabled
                            value={
                              current_qs === 1
                                ? isSubmitCode_qs1
                                  ? q1_testCase_Current_output
                                  : q1_run_output
                                : current_qs === 2
                                ? isSubmitCode_qs2
                                  ? q2_testCase_Current_output
                                  : q2_run_output
                                : isSubmitCode_qs3
                                ? q3_testCase_Current_output
                                : q3_run_output
                            }
                            readOnly
                            className="scrollbar codeOutput"
                            style={{ height: "350px" }}
                            id="style-4"
                          ></textarea>
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : (
        <MobileWidth />
      )}
    </>
  );
}
