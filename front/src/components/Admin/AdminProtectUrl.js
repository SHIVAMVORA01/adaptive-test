function protect() {
  var t = sessionStorage.getItem("test");
  var t2 = sessionStorage.getItem("test2");
  var t3 = sessionStorage.getItem("test3");
  var t4 = sessionStorage.getItem("test4");
  var t5 = sessionStorage.getItem("test5");
  var t6 = sessionStorage.getItem("test6");

  if (t3 !== null) {
    return "/analytical";
  } else if (t !== null) {
    return "/aptitude";
  } else if (t2 !== null) {
    return "/computer";
  } else if (t4 !== null) {
    return "/coding";
  } else if (t5 !== null) {
    return "/domain";
  } else if (t6 !== null) {
    return "/personality";
  } else if (sessionStorage.getItem("result") === "true") {
    return "/result";
  } else {
    return "";
  }
}

export default { protect };
