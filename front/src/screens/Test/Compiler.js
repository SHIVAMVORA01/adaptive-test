import React, { Component, useEffect, useState } from "react";
import { Col, Row, Tabs, Tab } from "react-bootstrap";
import CodingQsComp from "../../components/TestScreeen/CodingQsComp";
import TestHeaderComp from "../../components/TestScreeen/TestHeaderComp";
import "../../css/Compiler.css";
import $ from "jquery";

export default function Compiler() {
  const [inputT, setInput] = useState("");
  const [output, setOutput] = useState();
  const [language_id, setLanguage_id] = useState();

  const [user_input, setUser_input] = useState();
  const [default_input, set_default_input] = useState();

  const [customInputCheck, setCustomInputCheck] = useState(false);
  const [isSubmitCode, setIsSubmitCode] = useState();

  const [testCase_1_output, set_testCase_1_output] = useState();
  const [testCase_2_output, set_testCase_2_output] = useState();
  const [testCase_3_output, set_testCase_3_output] = useState();
  const [testCase_Current_output, set_testCase_Current_output] = useState();

  const [testCase_1_output_error, set_testCase_1_output_error] = useState();
  const [testCase_2_output_error, set_testCase_2_output_error] = useState();
  const [testCase_3_output_error, set_testCase_3_output_error] = useState();

  useEffect(() => {
    setInput(localStorage.getItem("input") || ``);
    setOutput(``);
    setLanguage_id(localStorage.getItem("language_Id") || 2);
    set_default_input(69);
  }, []);

  function input(event) {
    event.preventDefault();
    setInput(event.target.value);
    localStorage.setItem("input", event.target.value);
  }

  function userInput(event) {
    event.preventDefault();
    !event.target.value ? setUser_input() : setUser_input(event.target.value);
    localStorage.setItem("user_input", event.target.value);
  }

  function language(event) {
    event.preventDefault();
    setLanguage_id(event.target.value);
    localStorage.setItem("language_Id", event.target.value);
  }

  async function submit(e) {
    set_testCase_Current_output("");
    e.preventDefault();
    if (customInputCheck && user_input === undefined) {
      alert("Please enter input");
    } else {
      let outputText = document.getElementsByClassName("codeOutput")[0];
      outputText.innerHTML = "";
      outputText.innerHTML += "Creating Submission ...\n";
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key":
              "d35b7822fcmshab047f684dc27bap12bb13jsnfc29849e5539", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            source_code: inputT,
            stdin: customInputCheck ? user_input : default_input, //stateVarialble
            language_id: language_id,
          }),
        }
      );

      outputText.innerHTML += "Submission Created ...\n";
      const jsonResponse = await response.json();
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };
      let flag = false;
      while (flag !== true) {
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
        if (jsonResponse.token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
          const getSolution = await fetch(url, {
            method: "GET",
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key":
                "d35b7822fcmshab047f684dc27bap12bb13jsnfc29849e5539", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
              "content-type": "application/json",
            },
          });
          jsonGetSolution = await getSolution.json();
          console.log(jsonGetSolution);
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
          }
        }
      }
      console.log(jsonGetSolution);

      if (jsonGetSolution.stdout) {
        const output = atob(jsonGetSolution.stdout);
        set_testCase_Current_output(
          `${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
        );
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);
        console.log(error);
        set_testCase_Current_output(`\n Error :${error}`);
      } else {
        const compilation_error = atob(jsonGetSolution.compile_output);
        outputText.innerHTML = "";
        outputText.innerHTML += `\n Error :${compilation_error}`;
      }
    }
  }

  async function submitCode(e) {
    setIsSubmitCode(true);
    set_testCase_1_output_error();
    set_testCase_2_output_error();
    set_testCase_3_output_error();
    e.preventDefault();
    let outputText = document.getElementsByClassName("codeOutput")[0];
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    set_testCase_Current_output("Creating Submission ...\n");
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions/batch",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key":
            "d35b7822fcmshab047f684dc27bap12bb13jsnfc29849e5539", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          submissions: [
            {
              source_code: inputT,
              stdin: 12, //stateVarialble
              language_id: language_id,
            },
            {
              source_code: inputT,
              stdin: "a", //stateVarialble
              language_id: language_id,
            },
            {
              source_code: inputT,
              stdin: 2, //stateVarialble
              language_id: language_id,
            },
          ],
        }),
      }
    );
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    outputText.innerHTML += "Submission Created ...\n";
    set_testCase_Current_output(
      testCase_Current_output + "Submission Created ...\n"
    );

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
      //   outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution[0].status.description}`;
      set_testCase_Current_output(
        `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.submissions[0].status.description}`
      );
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
            "x-rapidapi-key":
              "d35b7822fcmshab047f684dc27bap12bb13jsnfc29849e5539", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
        console.log(jsonGetSolution.submissions[1].status.description);
        console.log(jsonGetSolution);
        if (
          jsonGetSolution.submissions[0].status.description === "Accepted" &&
          jsonGetSolution.submissions[0].stderr == null &&
          jsonGetSolution.submissions[0].compile_output == null &&
          jsonGetSolution.submissions[1].status.description === "Accepted" &&
          jsonGetSolution.submissions[1].stderr == null &&
          jsonGetSolution.submissions[1].compile_output == null &&
          jsonGetSolution.submissions[2].status.description === "Accepted" &&
          jsonGetSolution.submissions[2].stderr == null &&
          jsonGetSolution.submissions[2].compile_output == null
        ) {
          flag = true;
        } else if (
          jsonGetSolution.submissions[1].status.description !== "In Queue" &&
          jsonGetSolution.submissions[1].status.description !== "Processing" &&
          jsonGetSolution.submissions[2].status.description !== "In Queue" &&
          jsonGetSolution.submissions[2].status.description !== "Processing" &&
          jsonGetSolution.submissions[0].status.description !== "In Queue" &&
          jsonGetSolution.submissions[0].status.description !== "Processing" &&
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
          jsonGetSolution.submissions[1].status.description !== "Processing" &&
          jsonGetSolution.submissions[2].status.description !== "In Queue" &&
          jsonGetSolution.submissions[2].status.description !== "Processing" &&
          jsonGetSolution.submissions[0].status.description !== "In Queue" &&
          jsonGetSolution.submissions[0].status.description !== "Processing"
        ) {
          flag = true;
        }
      } else {
        alert("token dont exists");
      }
    }

    for (var y = 0; y < jsonGetSolution.submissions.length; y++) {
      if (jsonGetSolution.submissions[y].stdout) {
        const output = atob(jsonGetSolution.submissions[y].stdout);

        var text = document.createTextNode(
          `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
        );
        console.log(output);

        if (y === 0) {
          set_testCase_1_output(
            `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
          );
          set_testCase_1_output_error(false);
          set_testCase_Current_output(
            `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
          );
        } else if (y === 1) {
          set_testCase_2_output_error(false);
          set_testCase_2_output(
            `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
          );
        } else if (y === 2) {
          set_testCase_3_output_error(false);
          set_testCase_3_output(
            `${output}\nExecution Time : ${jsonGetSolution.submissions[y].time} Secs\nMemory used : ${jsonGetSolution.submissions[y].memory} bytes\n`
          );
        }
      } else if (jsonGetSolution.submissions[y].stderr) {
        const error = atob(jsonGetSolution.submissions[y].stderr);

        if (y === 0) {
          set_testCase_1_output(`Error :${error}`);
          set_testCase_Current_output(`Error :${error}`);
          set_testCase_1_output_error(true);
        } else if (y === 1) {
          set_testCase_2_output(`Error :${error}`);
          set_testCase_2_output_error(true);
        } else if (y == 2) {
          set_testCase_3_output(`Error :${error}`);
          set_testCase_3_output_error(true);
        }
      } else {
        const compilation_error = atob(
          jsonGetSolution.submissions[y].compile_output
        );

        if (y === 0) {
          set_testCase_1_output(`Error :${compilation_error}`);
          set_testCase_1_output_error(true);
          set_testCase_Current_output(`Error :${compilation_error}`);
        } else if (y === 1) {
          set_testCase_2_output_error(true);
          set_testCase_2_output(`Error :${compilation_error}`);
        } else if (y === 2) {
          set_testCase_3_output_error(true);
          set_testCase_3_output(`Error :${compilation_error}`);
        }
      }
    }
  }

  class CustomTextarea {
    constructor(element) {
      this.element = element;
      this.textarea = this.element.querySelector(".textarea");
      this.numbers = this.element.querySelector(".linenumbers");
      this.numberOfNumbers = 1;
      this.addMoreNumbers();
      this.initEventListeners();
    }

    addMoreNumbers() {
      let html = "";

      for (let i = this.numberOfNumbers; i < this.numberOfNumbers + 100; i++) {
        html += `<div class='number'>${i}</div>`;
      }

      this.numberOfNumbers += 100;
      this.numbers.innerHTML += html;
    }

    initEventListeners() {
      this.textarea.addEventListener("scroll", () => {
        this.numbers.style.transform = `translateY(-${this.textarea.scrollTop}px)`;

        if (
          Math.abs(
            this.numbers.offsetHeight -
              this.textarea.offsetHeight -
              this.textarea.scrollTop
          ) < 100
        ) {
          this.addMoreNumbers();
        }
      });
    }
  }

  $(document).ready(function () {
    "use strict";

    const textarea = new CustomTextarea(
      document.querySelector(".custom-textarea")
    );
  });

  return (
    <>
      {/* <div className="row container-fluid">
          <div className="col-6 ml-4 ">
            <label htmlFor="solution ">
              <span className="badge badge-info heading mt-2 ">
                <i className="fas fa-code fa-fw fa-lg"></i> Code Here
              </span>
            </label>
            <textarea spellcheck="false"
              required
              name="solution"
              id="source"
              onChange={(e)=>input(e)}
              className=" source"
              defaultValue={inputT}
            ></textarea>
            <button
              type="submit"
              className="btn btn-danger ml-2 mr-2 "
              onClick={submit}
            >
              <i className="fas fa-cog fa-fw"></i> Run
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-2 mr-2 "
              onClick={submitCode}
            >
              <i className="fas fa-cog fa-fw"></i> Submit
            </button>

            <label htmlFor="tags" className="mr-1">
              <b className="heading">Language:</b>
            </label>
            <select
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
          </div>
          <div className="col-5">
            <div>
              <span className="badge badge-info heading my-2 ">
                <i className="fas fa-exclamation fa-fw fa-md"></i> Output
              </span>
              <textarea id="output"></textarea>
            </div>
          </div>
        </div>
        <div className="mt-2 ml-5">
          <span className="badge badge-primary heading my-2 ">
            <i className="fas fa-user fa-fw fa-md"></i> User Input
          </span>
          <br />
          <textarea id="input" onChange={userInput}></textarea>
        </div> */}
      <Row>
        <Col md={6}>
          <Row>
            <div className="TestHeaderComp" style={{ paddingBottom: "7px" }}>
              <TestHeaderComp
                timer={3000}
                start={true}
                reset={false}
                timeKey="Time"
                noTotal={true}
                header="Coding"
                nextpage={"result"}
              ></TestHeaderComp>
            </div>
          </Row>
          <Row>
            <div
              className="basicRec"
              style={{
                marginTop: "5px",
                height: "550px",
                backgroundColor: "#F7F7F7",
              }}
            >
              <Tabs
                defaultActiveKey="Q1"
                id="uncontrolled-tab-example"
                style={{ marginBottom: "0px !important" }}
                className="mb-3"
              >
                <Tab eventKey="Q1" title="Q1">
                  <CodingQsComp></CodingQsComp>
                </Tab>
                <Tab eventKey="Q2" title="Q2">
                  <CodingQsComp></CodingQsComp>
                </Tab>
                <Tab eventKey="Q3" title="Q3">
                  <CodingQsComp></CodingQsComp>
                </Tab>
              </Tabs>
            </div>
          </Row>
        </Col>
        <Col md={6}>
          <div style={{ marginLeft: "45px" }}>
            <Row
              style={{
                paddingBottom: "5px",
                paddingLeft: "40%",
                height: "40px",
                marginBottom: "10px",
              }}
            >
              <Col>
                <button
                  type="button"
                  style={{ color: "white", width: "fit-content" }}
                  className="btn scTest"
                >
                  Next Section
                </button>
              </Col>
              <Col>
                <button
                  type="button"
                  className="btn btn-success"
                  style={{
                    backgroundColor: "#081466",
                    width: "fit-content",
                    borderRadius: "10px",
                    color: "white",
                    padding: "7px 10px",
                  }}
                >
                  Finish Test
                </button>
              </Col>
            </Row>
            <Row style={{ marginTop: "5px" }}>
              <div
                className="basicRec"
                style={{ backgroundColor: "#F7F7F7", padding: "5px 5px" }}
              >
                <div class="custom-textarea">
                  <textarea
                    class="textarea"
                    spellCheck={false}
                    defaultValue={inputT}
                    onChange={(e) => input(e)}
                  ></textarea>
                  <div class="linenumbers"></div>
                </div>
              </div>
            </Row>

            <Row
              style={{ paddingTop: "5px", paddingBottom: "0", height: "42px" }}
            >
              <Col lg={3}>
                <select
                  style={{ width: "90px" }}
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
              <Col lg={3}>
                <div
                  class="custom-control custom-checkbox"
                  style={{ paddingTop: "8px" }}
                >
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    style={{ marginRight: "4px" }}
                    onClick={(e) => {
                      console.log(e);
                      setCustomInputCheck(e.target.checked);
                    }}
                    id="defaultUnchecked"
                  />
                  <label class="custom-control-label" for="defaultUnchecked">
                    Custom Input
                  </label>
                </div>
              </Col>
              <Col lg={3}>
                <button
                  type="submit"
                  className="btn scTest ml-2 mr-2 "
                  style={{ color: "white", width: "fit-content" }}
                  onClick={(e) => {
                    setIsSubmitCode();
                    submit(e);
                  }}
                >
                  <i className="fas fa-cog fa-fw"></i> Run
                </button>
              </Col>
              <Col lg={3}>
                <button
                  type="submit"
                  className="btn scTest ml-2 mr-2 "
                  style={{ color: "white", width: "fit-content" }}
                  onClick={submitCode}
                >
                  <i className="fas fa-cog fa-fw"></i> Submit
                </button>
              </Col>
            </Row>
            <Row>
              <div
                className="basicRec"
                style={{
                  marginTop: "5px",
                  height: "190px",
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
                      onChange={userInput}
                    ></textarea>
                  </Tab>
                  <Tab eventKey="Result" title="result">
                    <Row>
                      {isSubmitCode !== undefined && (
                        <Col md={3}>
                          <div>
                            <Row className="" style={{ height: "20%" }}>
                              {testCase_1_output_error !== undefined ? (
                                <Col style={{ paddingLeft: "0%" }}>
                                  <button
                                    className={
                                      !testCase_1_output_error
                                        ? "btn scTest"
                                        : "btn btn-danger"
                                    }
                                    onClick={(e) => {
                                      set_testCase_Current_output(
                                        testCase_1_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
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
                                      set_testCase_Current_output(
                                        testCase_1_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
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
                            <Row className="">
                              {testCase_2_output_error !== undefined && (
                                <Col style={{ paddingLeft: "0%" }}>
                                  <button
                                    className={
                                      !testCase_2_output_error
                                        ? "btn scTest"
                                        : "btn btn-danger"
                                    }
                                    onClick={(e) => {
                                      set_testCase_Current_output(
                                        testCase_2_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
                                      color: "white",
                                      borderRadius: "0",
                                      width: "100%",
                                    }}
                                  >
                                    Test Case 2
                                  </button>
                                </Col>
                              )}
                              {testCase_2_output_error === undefined && (
                                <Col style={{ paddingLeft: "0%" }}>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={(e) => {
                                      set_testCase_Current_output(
                                        testCase_2_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
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
                              {testCase_3_output_error !== undefined ? (
                                <Col style={{ paddingLeft: "0%" }}>
                                  <button
                                    className={
                                      !testCase_3_output_error
                                        ? "btn scTest"
                                        : "btn btn-danger"
                                    }
                                    onClick={(e) => {
                                      set_testCase_Current_output(
                                        testCase_3_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
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
                                      set_testCase_Current_output(
                                        testCase_3_output
                                      );
                                    }}
                                    style={{
                                      marginBottom: "1px",
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
                      <Col md={isSubmitCode ? 9 : 12}>
                        <textarea
                          disabled
                          defaultValue={testCase_Current_output}
                          readOnly
                          className="scrollbar codeOutput"
                          id="style-4"
                        ></textarea>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </div>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}
