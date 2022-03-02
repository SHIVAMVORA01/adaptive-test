function getGraduationYears() {
  var oneYearFromNow = new Date();
  let a = [];
  for (let x = -3; x < 5; x++) {
    var firstDayOfYear = new Date(oneYearFromNow.getFullYear() + x, 0, 1);
    a.push(firstDayOfYear.getFullYear());
  }
  return a;
}
export default getGraduationYears;
