import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const GenericPdfDownloader = ({ rootElementId, downloadFileName }) => {
  const downloadPdfDocument = () => {
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      var imgData = canvas.toDataURL("image/png");
      var imgWidth = 190;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF("p", "mm");
      var position = 0;

      doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        doc.addPage();
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(`${downloadFileName}.pdf`);
    });
  };

  return (
    <button
      onClick={downloadPdfDocument}
      style={{
        backgroundColor: "white",
        marginLeft: "10px",
        outline: "none",
        border: "0",
      }}
    >
      <i class="fa fa-download" aria-hidden="true"></i>
    </button>
  );
};

export default GenericPdfDownloader;
