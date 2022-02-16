// import React, { useState } from "react";
// import { Col, Row } from "react-bootstrap";
// import axiosInstance from "../../axios";
// import { useNavigate } from "react-router";
// import "../../css/AdminAddQsScreen.css";


// function AdminAddQs() {
//   const [optionArray, addOptionArray] = useState([]);
//   const [countOpt, setCountOpt] = useState(2);
//   const navigate = useNavigate();

//   function handleSubmit(e) {
//     e.preventDefault();
//     console.log("handlesubmit");
//     var dictionary = {};
//     for (var x = 0; x < e.target.length; x++) {
//       if (
//         e.target[x] instanceof HTMLInputElement ||
//         e.target[x] instanceof HTMLSelectElement
//       ) {
//         dictionary[e.target[x].name] = e.target[x].value;
//       }
//     }
//     console.log(dictionary);
//     axiosInstance.post("api/admin/addQs", { data: dictionary }).then((res) => {
//       console.log("saved to db");

//       navigate("/admin/addQs");
//     });
//   }
//   function addOpt(e) {
//     setCountOpt(countOpt + 1);
//     console.log("Add opt clicked");
//     addOptionArray(function (oldArray) {
//       return [
//         ...oldArray,
//         <Row style={{ marginTop: "25px" }}>
//           <Col xs={12}>
//             <div className="form-check">
//               <input
//                 className="correctOpt"
//                 type="radio"
//                 value={`option${countOpt + 1}`}
//                 id={`flexCheckDefault${countOpt + 1}`}
//               />
//               <label
//                 style={{ width: "100%" }}
//                 for={`flexCheckDefault${countOpt + 1}`}
//               >
//                 <input
//                   className="rectangleInput"
//                   name={`option${countOpt + 1}`}
//                   style={{ width: "100%" }}
//                   type="text"
//                   placeholder={`Add option${countOpt + 1}`}
//                   required
//                 ></input>
//               </label>
//             </div>
//           </Col>
//         </Row>,
//       ];
//     });
//   }
//   return (
//     <div>
//       <form onSubmit={(e) => handleSubmit(e)}>
//         Type:
//         <select
//           className="form-select"
//           name="type"
//           aria-label="Default select example"
//         >
//           <option value="1">Easy</option>
//           <option value="2">Medium</option>
//           <option value="3">Hard</option>
//         </select>
//         <Row style={{ marginTop: "70px" }}>
//           <Col>
//             <input
//               className="rectangle"
//               name="question"
//               type="text"
//               placeholder="Add Qs"
//               style={{ width: "100%" }}
//             ></input>
//           </Col>
//         </Row>
//         <Row style={{ marginTop: "25px" }}>
//           <Col xs={12}>
//             <div className="form-check">
//               <input
//                 name="correctOpt"
//                 type="radio"
//                 value="option1"
//                 id="flexCheckDefault1"
//                 required
//               />
//               <label style={{ width: "100%" }} for="flexCheckDefault1">
//                 <input
//                   className="rectangle"
//                   name="option1"
//                   style={{ width: "100%" }}
//                   type="text"
//                   placeholder="Add option1"
//                   required
//                 ></input>
//               </label>
//             </div>
//           </Col>
//         </Row>
//         <Row style={{ marginTop: "25px" }}>
//           <Col xs={12}>
//             <div className="form-check">
//               <input
//                 name="correctOpt"
//                 type="radio"
//                 value="option2"
//                 id="flexCheckDefault2"
//               />
//               <label style={{ width: "100%" }} for="flexCheckDefault2">
//                 <input
//                   className="rectangle"
//                   name="option2"
//                   style={{ width: "100%" }}
//                   type="text"
//                   placeholder="Add option2"
//                   required
//                 ></input>
//               </label>
//             </div>
//           </Col>
//         </Row>
//         {optionArray}
//         <Row style={{ marginTop: "35px", paddingLeft: "200px" }}>
//           <Col>
//             <button
//               style={{ backgroundColor: "#10B65C", width: "150px" }}
//               type="button"
//               onClick={(e) => addOpt(e)}
//               className="btn btn-primary"
//             >
//               Add option
//             </button>
//           </Col>
//           <Col>
//             <button
//               style={{ backgroundColor: "#10B65C", width: "150px" }}
//               type="submit"
//               className="btn btn-primary"
//             >
//               Save
//             </button>
//           </Col>
//         </Row>
//       </form>
//     </div>
//   );
// }

// export default AdminAddQs;