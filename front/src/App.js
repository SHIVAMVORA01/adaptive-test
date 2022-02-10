import React from "react";
import TestScreen from "./screens/TestScreen";
import Home from "./screens/Home";
import logo from "./img/logo.png";
import { Col, Navbar, Row } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./screens/Login";
import Logout from "./screens/logout";
import Result from "./screens/Result";
import Error from "./screens/Error";
import AdminHome from "./screens/Admin/Home";
import AdminAddQs from "./screens/Admin/AddQs";
import SetQuestion from "./screens/Admin/SetQuestion";
import NewTest from "./screens/Admin/NewTest";
import CFTestScreen from "./screens/Test/CFTestScreen";
import PTestScreen from "./screens/Test/PTestScreen";
import DTestScreen from "./screens/Test/DTestScreen";
import ScheduledTest from "./screens/Admin/ScheduledTest";
import ViewSchdlTest from "./screens/Admin/ViewSchdlTest";
import Compiler from "./screens/Test/Compiler";
import CompScreen from "./screens/Test/compScreen";
import PersonalityResultComp from "./components/Result/personalityResultComp";
import ACEEditor from "./components/TestScreeen/AceEditor";
import Page_404 from "./screens/Page_404";
import "./css/App.css";
import ImageUpload from "./components/Admin/ImageUpload";
import DetailScreen from "./screens/DetailScreen";
function App() {
  return (
    <div className="App" id="element">
      <div>
        <Navbar
          style={{
            backgroundColor: "#fff",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            color: "black",
            paddingTop: "0px",
            paddingBottom: "0px",
          }}
          expand="xl"
        >
          <Navbar.Brand className="navBrand">
            <img
              className="logoImage"
              height="80px"
              width="80px"
              alt="logo"
              src={logo}
            ></img>
            <div className="logoTitle">
              <h5 className="djsce">DJSCE</h5>
              <h5 className="it">INFORMATION TECHNOLOGY</h5>
            </div>
          </Navbar.Brand>
        </Navbar>
        <Router>
          <Routes>
            <Route
              path="/testScreen"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <TestScreen />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/login"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Login />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/result"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Result />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/logout"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Logout />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/error"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Error />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/home"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <AdminHome />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/addQs"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <AdminAddQs />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/newTest"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <NewTest />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/setQs"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <SetQuestion />
                  </Col>
                </Row>
              }
            />
            <Route path="/home" exact element={<Home />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/admin/personality" exact element={<PTestScreen />} />
            <Route path="/admin/computer" exact element={<CFTestScreen />} />
            <Route path="/admin/domain" exact element={<DTestScreen />} />
            <Route path="/admin/analytical" exact element={<CompScreen />} />
            <Route
              path="/admin/scheduledTest"
              exact
              element={<ScheduledTest />}
            />
            <Route
              path="/admin/viewScheduledTest"
              exact
              element={<ViewSchdlTest />}
            />
            <Route path="/admin/compiler" exact element={<Compiler />} />
            <Route path="/details" exact element={<DetailScreen />} />

            {/* do not change */}
            <Route path="*" element={<Page_404 />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
