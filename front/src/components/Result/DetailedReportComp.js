import React from "react";
import logo from "../../img/logo.png";
import svkmLogo from "../../img/svkmLogo.png";
import { Col, Row, Card, Navbar } from "react-bootstrap";
import "../../css/ResultScreen.css";
import Chart_score from "./Chart_score";
import ReactSpeedometer from "react-d3-speedometer";
import BulletChart from "./BulletChart";
import CustomTimer from "../../screens/Admin/CustomTimer";


function DetailedReportComp({
  SEP,
  SEFP,
  LO,
  HI,
  SE,
  SAP,
  SAFP,
  SA,
  SC,
  SCP,
  SCFP,
  flev,
  SOP,
  SOFP,
  SO,
  Nick,
  Country,
  SNP,
  SNFP,
  Category,
  SN,
  mrksScoredPercent,
  user_detail,
  timeTaken,
  totalMarksScored,
  startTime,
  componentRef,
}) {
  function sum() {
    let sum = 0;
    for (let i = 0; i < mrksScoredPercent.length; i++) {
      sum += mrksScoredPercent[i];
    }
    sum = parseFloat(sum / mrksScoredPercent.length).toFixed(2);
    return sum 
  };

  return (
    <div id="generatePdf" ref={componentRef} className="print-container" style={{ fontSize: "13.6px" }}>
      <Navbar
        style={{
          backgroundColor: "#fff",
          color: "black",
          paddingTop: "0px",
          paddingBottom: "0px",
          marginBottom: "0px",
          height: "100%",
        }}
        expand="xl"
      >
        <Navbar.Brand>
          <Row style={{ marginLeft: "120px" }}>
            <Col>
              {" "}
              <img
                className="logoImage"
                height="80px"
                width="80px"
                alt="logo"
                src={logo}
              ></img>
            </Col>
            <Col>
              {" "}
              <div
                style={{
                  margin: "0 20px",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                <h5 className="djsce" style={{ textAlign: "center" }}>
                  DJSCE INFORMATION TECHNOLOGY{" "}
                </h5>
                <h5 className="it" style={{ textAlign: "center" }}>
                  Placement Portal
                </h5>
              </div>
            </Col>
            <Col>
              {" "}
              <img
                className="logoImage"
                height="80px"
                width="80px"
                alt="logo"
                src={svkmLogo}
              ></img>
            </Col>
          </Row>
        </Navbar.Brand>
      </Navbar>
      <Row >
        <div className="line_through" style={{ width: "95%" }}></div>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col xs="6" md="6">
              <p style={{ marginLeft: "30px" }}>
                <b>Candidate Name :</b> {user_detail?.name || "Chaitanya Kumbhar"}
              </p>
              <p style={{ marginLeft: "30px" }}>
                <b>Email :</b>{" "} {user_detail?.email || "kchaitanya1911@gmail.com"}
              </p>
            </Col>
            <Col xs="6" md="6">
              <p style={{ textAlign: "right", marginRight: "90px" }}>
                <b>Time Taken :</b>{" "}
                <CustomTimer start={false} time={timeTaken || "00:00:20"} /> </p>
              <p style={{ textAlign: "right", marginRight: "130px" }}>
                <b>Marks Scored :</b> {totalMarksScored || 45}
              </p>
            </Col>
          </Row>
          <div style={{ width: "95%", height: "33px", backgroundColor: "#293E6F", color: "white", marginLeft: "20px", marginTop: "10px" }}>
            <p style={{ textAlign: "center", fontWeight: "400", paddingTop: "5px" }}>Score Analysis</p>
          </div>
          <Col>

            <p style={{ marginTop: "35px", paddingLeft: "390px", fontSize: "30px" }}><b> { sum() || 45} %</b> </p>
            <div style={{ marginLeft: "250px" }}>
              <ReactSpeedometer
                width={350}
                needleHeightRatio={0.7}
                value={totalMarksScored * 2} //$
                customSegmentStops={[0, 200, 400, 600, 800, 1000]}
                currentValueText=" "
                customSegmentLabels={[
                  {
                    position: "OUTSIDE",
                    color: "#d8dee9",
                  },
                  {
                    position: "OUTSIDE",
                    color: "#d8dee9",
                  },
                  {
                    position: "OUTSIDE",
                    color: "#d8dee9",
                  },
                  {
                    position: "OUTSIDE",
                    color: "#d8dee9",
                  },
                  {
                    position: "OUTSIDE",
                    color: "#d8dee9",
                  },
                ]}
                ringWidth={47}
                needleTransitionDuration={3333}
                needleTransition="easeElastic"
                needleColor={"black"}
                textColor={"#d8dee9"}
              />
            </div>
            <p style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "13.6px",
              textAlign: "center",
              color: "#000000",
              marginTop: "-50px"
            }}
            >
              This score is seen as an indicator of your overall profile and
              performance in the test.
            </p>
          </Col>
          <div style={{ width: "95%", height: "33px", backgroundColor: "#293E6F", color: "white", marginLeft: "20px", marginTop: "20px" }}>
            <p style={{ textAlign: "center", fontWeight: "400", paddingTop: "5px" }}> Section Score Analysis</p>
          </div>
          <Row>
            <Col xs="4" md={4}>
              <Chart_score
                percent={mrksScoredPercent?.[0]}
                label="Aptitude"
              />
            </Col>
            <Col xs="4" md={4}>
              <Chart_score
                percent={mrksScoredPercent?.[1]}
                label="Computer Fundamentals"
              />
            </Col>
            <Col xs="4" md={4}>
              <Chart_score
                percent={mrksScoredPercent?.[2]}
                label="Domain"
              />
            </Col>
            <Col xs="6" md={6}>
              <Chart_score
                percent={mrksScoredPercent?.[3]}
                label="Coding"
              />
            </Col>
            <Col xs="6" md={6}>
              <Chart_score
                percent={mrksScoredPercent?.[4]}
                label="Analytical Writing"
              />
            </Col>
            <p style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: "13.6px",
              lineHeight: "21px",
              textAlign: "center",
              color: "#000000",
            }}
            >
              {" "}
              These radial charts are seen as an indicator of your
              performance across the various domains{" "}
            </p>
          </Row>
          <div className="page-break" />
          <div style={{ width: "95%", height: "33px", backgroundColor: "#293E6F", color: "white", marginLeft: "20px", marginTop: "40px" }}>
            <p style={{ textAlign: "center", fontWeight: "400", paddingTop: "5px" }}>Personality Analysis</p>
          </div>
          <Row>
            <div style={{ fontSize: "13.6px", marginLeft: "30px", marginTop: "40px", paddingRight: "90px" }}>
              <p>A personality test is a tool that can help you figure out who you are. This is critical for a business because people with different personalities approach tasks in different ways. </p>
              <p>The chart below categorizes your personality based on the "Big Five" personality traits. Remember that a low score does not imply poor performance, and a high score does not imply excellent performance, because personality has no concept of performance.</p>
              <p>The personality map below depicts your position in relation to the general population for various personality traits.</p>
            </div>
            <div>
              <p style={{ fontSize: "13.6px", marginLeft: "30px", marginTop: "30px" }} className="factor_5_modal">
                Extraversion
                <small style={{ fontSize: "11.6px" }}>
                  {" "}
                  - Characterized by positive emotions. Enjoying company of
                  others
                </small>
              </p>
              <BulletChart
                secId={0}
                score={SE < LO ? 30 : SE >= LO && SE <= HI ? 60 : 85}
              ></BulletChart>

              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal_result">
                {" "}
                {SE < LO && (
                  <p>
                    {" "}
                    Your score on Extraversion is low, indicating you are
                    introverted, reserved, and quiet. You enjoy solitude and
                    solitary activities. Your socializing tends to be
                    restricted to a few close friends.{" "}
                  </p>
                )}
                {SE >= LO && SE <= HI && (
                  <>
                    <br />{" "}
                    <p>
                      {" "}
                      <em>
                        {" "}
                        Your score on Extraversion is average, indicating
                        you are neither a subdued loner nor a jovial
                        chatterbox. You enjoy time with others but also time
                        alone.{" "}
                      </em>{" "}
                    </p>
                  </>
                )}
                {SE > HI && (
                  <>
                    <br />{" "}
                    <p>
                      {" "}
                      <em>
                        {" "}
                        Your score on Extraversion is high, indicating you
                        are sociable, outgoing, energetic, and lively. You
                        prefer to be around people much of the time.{" "}
                      </em>{" "}
                    </p>
                  </>
                )}
              </p>

              <p style={{ fontSize: "13.6px", marginLeft: "30px" }} className="factor_5_modal">
                Agreeableness
                <small style={{ fontSize: "11.6px" }}>
                  {" "}
                  - Tendency to be compassionate and cooperative
                </small>
              </p>
              <BulletChart
                secId={1}
                score={SA < LO ? 30 : SA >= LO && SA <= HI ? 60 : 85}
              ></BulletChart>
              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal_result">
                {" "}
                {SA < LO && (
                  <p>
                    {" "}
                    Your score on Agreeableness is low, indicating less
                    concern with others' needs than with your own. People
                    see you as tough, critical, and uncompromising.{" "}
                  </p>
                )}
                {SA >= LO && SA <= HI && (
                  <p>
                    {" "}
                    Your level of Agreeableness is average, indicating some
                    concern with others' Needs, but, generally,
                    unwillingness to sacrifice yourself for others.{" "}
                  </p>
                )}
                {SA > HI && (
                  <p>
                    {" "}
                    Your high level of Agreeableness indicates a strong
                    interest in others' needs and well-being. You are
                    pleasant, sympathetic, and cooperative.{" "}
                  </p>
                )}
              </p>
              <p style={{ fontSize: "13.6px", marginLeft: "30px" }} className="factor_5_modal">
                Conscientiousness
                <small style={{ fontSize: "11.6px" }}>
                  {" "}
                  - Tendency to show self-discipline. Planned rather than
                  spontaneous behavior.
                </small>
              </p>
              <BulletChart
                secId={2}
                score={SC < LO ? 30 : SC >= LO && SC <= HI ? 60 : 85}
              ></BulletChart>
              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal_result">
                {" "}
                {SC < LO && (
                  <p>
                    Your score on Conscientiousness is low, indicating you
                    like to live for the moment and do what feels good now.
                    Your work tends to be careless and disorganized.
                  </p>
                )}
                {SC >= LO && SC <= HI && (
                  <p>
                    Your score on Conscientiousness is average. This means
                    you are reasonably reliable, organized, and
                    self-controlled.
                  </p>
                )}
                {SC > HI && (
                  <p>
                    Your score on Conscientiousness is high. This means you
                    set clear goals and pursue them with determination.
                    People regard you as reliable and hard-working.
                  </p>
                )}
              </p>
              <div className="page-break" />
              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal">
                Neuroticism
                <small style={{ fontSize: "11.6px" }}>
                  {" "}
                  - Tendency to remain balanced in ordinary situations.
                  Desirable trait
                </small>
              </p>
              <BulletChart
                secId={3}
                score={SN < LO ? 30 : SN >= LO && SN <= HI ? 60 : 85}
              ></BulletChart>
              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal_result">
                {" "}
                {SN < LO && (
                  <p>
                    Your score on Neuroticism is low, indicating that you
                    are exceptionally calm, composed and unflappable. You do
                    not react with intense emotions, even to situations that
                    most people would describe as stressful.
                  </p>
                )}
                {SN >= LO && SN <= HI && (
                  <p>
                    Your score on Neuroticism is average, indicating that
                    your level of emotional reactivity is typical of the
                    general population. Stressful and frustrating situations
                    are somewhat upsetting to you, but you are generally
                    able to get over these feelings and cope with these
                    situations.
                  </p>
                )}
                {SN > HI && (
                  <p>
                    Your score on Neuroticism is high, indicating that you
                    are easily upset, even by what most people consider the
                    normal demands of living. People consider you to be
                    sensitive and emotional.
                  </p>
                )}
              </p>

              <p style={{ fontSize: "13.6px", marginLeft: "30px" }} className="factor_5_modal">
                Openness
                <small style={{ fontSize: "11.6px" }}>
                  {" "}
                  - General appreciation for imagination and variety of
                  experience.
                </small>
              </p>
              <BulletChart
                secId={4}
                score={SO < LO ? 30 : SO >= LO && SO <= HI ? 60 : 85}
              ></BulletChart>
              <p style={{ fontSize: "13.6px", marginLeft: "30px", margin: "30px" }} className="factor_5_modal_result">
                {SO < LO && (
                  <p>
                    Your score on Openness to Experience is low, indicating
                    you like to think in plain and simple terms. Others
                    describe you as down-to-earth, practical, and
                    conservative.
                  </p>
                )}

                {SO >= LO && SO <= HI && (
                  <p>
                    Your score on Openness to Experience is average,
                    indicating you enjoy tradition but are willing to try
                    new things. Your thinking is neither simple nor complex.
                    To others you appear to be a well-educated person but
                    not an intellectual.{" "}
                  </p>
                )}

                {SO > HI && (
                  <p>
                    Your score on Openness to Experience is high, indicating
                    you enjoy novelty, variety, and change. You are curious,
                    imaginative, and creative.
                  </p>
                )}
              </p>
            </div>
          </Row>
        </Col>
      </Row>

    </div>
  );
}

export default DetailedReportComp;
