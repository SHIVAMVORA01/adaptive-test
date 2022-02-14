import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

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
          series={[percent]}
          options={chartOpt(label)}
          type="radialBar"
          height={300}
        />
      )}
    </>
  );
}

export default Chart_score;
