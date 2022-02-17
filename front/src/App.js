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
import AdminHome from "./screens/Admin/AdminHome";
import SetQuestion from "./screens/Admin/SetQuestion";
import NewTest from "./screens/Admin/NewTest";
import CFTestScreen from "./screens/Test/CFTestScreen";
import PTestScreen from "./screens/Test/PTestScreen";
import DTestScreen from "./screens/Test/DTestScreen";
import ScheduledTest from "./screens/Admin/ScheduledTest";
import ViewSchdlTest from "./screens/Admin/ViewSchdlTest";
import Compiler from "./screens/Test/Compiler";
import CompScreen from "./screens/Test/compScreen";
import Page_404 from "./screens/Page_404";
import DetailScreen from "./screens/DetailScreen";
import PrivateRoute from "./components/PrivateRoute";
import "./css/App.css";
import Signup from "./screens/Signup";
import ChangePass from "./screens/ChangePass";
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
              path="/signup"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Signup />
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
            <Route exact path="/admin/home" element={<PrivateRoute />}>
              <Route
                path="/admin/home"
                exact
                element={
                  <Row style={{ margin: "0 0 0 0" }}>
                    <Col style={{ padding: "0px 90px 0px 0px" }}>
                      <AdminHome />
                    </Col>
                  </Row>
                }
              />
            </Route>

            <Route exact path="/admin/newTest" element={<PrivateRoute />}>
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
            </Route>

            <Route exact path="/admin/setQs" element={<PrivateRoute />}>
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
            </Route>

            <Route
              path="/home"
              exact
              element={
                <Row style={{ margin: "0", overflowX: "hidden" }}>
                  <Col style={{ padding: "0px" }}>
                    <Home />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/"
              exact
              element={
                <Row style={{ margin: "0", overflowX: "hidden" }}>
                  <Col style={{ padding: "0" }}>
                    <Home />
                  </Col>
                </Row>
              }
            />

            <Route
              path="/admin/personality"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <PTestScreen />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/computer"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <CFTestScreen />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/domain"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <DTestScreen />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/admin/analytical"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <CompScreen />
                  </Col>
                </Row>
              }
            />
            <Route exact path="/admin/scheduledTest" element={<PrivateRoute />}>
              <Route
                path="/admin/scheduledTest"
                exact
                element={
                  <Row style={{ margin: "20px 0 0 0" }}>
                    <Col style={{ padding: "10px 90px" }}>
                      <ScheduledTest />
                    </Col>
                  </Row>
                }
              />
            </Route>
            <Route
              exact
              path="/admin/viewScheduledTest"
              element={<PrivateRoute />}
            >
              <Route
                path="/admin/viewScheduledTest"
                exact
                element={
                  <Row style={{ margin: "20px 0 0 0" }}>
                    <Col style={{ padding: "10px 90px" }}>
                      <ViewSchdlTest />
                    </Col>
                  </Row>
                }
              />
            </Route>
            <Route
              path="/admin/compiler"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Compiler />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/details"
              exact
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <DetailScreen />
                  </Col>
                </Row>
              }
            />
            <Route
              path="/change-pass"
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <ChangePass />
                  </Col>
                </Row>
              }
            />
            {/* do not change */}
            <Route
              path="*"
              element={
                <Row style={{ margin: "20px 0 0 0" }}>
                  <Col style={{ padding: "10px 90px" }}>
                    <Page_404 />
                  </Col>
                </Row>
              }
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
