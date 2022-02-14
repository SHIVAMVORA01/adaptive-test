function protect() {
  var t = localStorage.getItem("test");
  var t2 = localStorage.getItem("test2");
  var t3 = localStorage.getItem("test3");
  var t4 = localStorage.getItem("test4");
  var t5 = localStorage.getItem("test5");
  var t6 = localStorage.getItem("test6");

  if (t3 !== null) {
    return "/admin/analytical";
  } else if (t !== null) {
    return "/testScreen";
  } else if (t2 !== null) {
    return "/admin/computer";
  } else if (t4 !== null) {
    return "/admin/compiler";
  } else if (t5 !== null) {
    return "/admin/domain";
  } else if (t6 !== null) {
    return "/admin/personality";
  } else if (localStorage.getItem("result") === `true`) {
    return "/result";
  }
  return "";
}

export default { protect };
