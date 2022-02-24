import React from "react";
import { ChartAxis, ChartBullet } from "@patternfly/react-charts";

function BulletChart({ secId, score = 30 }) {
  const sectionArr = [
    ["Introvert", "Moderately Introvert", "Moderately Extrovert", "Extrovert"],
    [
      "Self Centered",
      "Moderately Self Centered",
      "Moderately Agreeable",
      "Agreeable",
    ],
    [
      "Disorganized",
      "Moderately Disorganized",
      "Moderately Conscientious",
      "Conscientious",
    ],
    ["Tranquil", "Moderately Tranquil", "Moderately Neurotic", "Neurotic"],
    [
      "Unimaginative",
      "Moderately Unimaginative",
      "Moderately Imaginative",
      "Imaginative",
    ],
  ];
  return (
    <div style={{ height: "120px", width: "100%" }}>
      <ChartBullet
        axisComponent={
          <ChartAxis
            tickValues={[0, 25, 50, 75, 100]}
            tickFormat={(val) => {
              switch (val) {
                case 0:
                  return "Not attempted";
                case 25:
                  return sectionArr[secId][0];
                case 50:
                  return sectionArr[secId][1];
                case 75:
                  return sectionArr[secId][2];
                case 100:
                  return sectionArr[secId][3];
              }
            }}
          />
        }
        constrainToVisibleArea
        height={150}
        labels={({ datum }) => `${datum.name}`}
        maxDomain={{ y: 100 }}
        primarySegmentedMeasureData={[{ name: "Measure", y: score }]}
        qualitativeRangeData={[
          { name: sectionArr[secId][0], y: 25 },
          { name: sectionArr[secId][1], y: 50 },
          { name: sectionArr[secId][2], y: 75 },
          { name: sectionArr[secId][3], y: 100 },
        ]}
        width={800}
      />{console.log(sectionArr)}
    </div>
  );
}
export default BulletChart;
