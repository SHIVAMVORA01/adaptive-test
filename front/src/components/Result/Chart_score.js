import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ChartScore from "../../css/ChartScore.css";

function Chart_score({ percent, label }) {
  const [isCompSet, setisCompSet] = useState(false);
  function chartOpt(label) {
    return {
      plotOptions: {
        radialBar: {
          hollow: {
            size: "80%",
          },
        },
      },
      labels: [label],
    };
  }
  useEffect(() => {
    setisCompSet(true);
  }, []);

  return (
    <>
      {isCompSet && (
        <Chart
          style={{ fontFamily: "Poppins", fontSize: "13.6px" }}
          series={[percent]}
          options={chartOpt(label)}
          type="radialBar"
          height={250}
        />
      )}
    </>
  );
}

export default Chart_score;
