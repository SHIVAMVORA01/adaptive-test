import axios from "axios";
import React, { useState } from "react";
import axiosInstance from "../../axios";
import Alert from "./Alert";
import { Image } from "cloudinary-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ImageUpload() {
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
      setErrMsg("something went wrong!");
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await axiosInstance.post("/api/testing", {
        data: { image: base64EncodedImage },
      });
      setFileInputState("");
      setPreviewSource("");
      setSuccessMsg("Image uploaded successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setErrMsg("Something went wrong!");
    }
  };
  return (
    <div>
      <h1 className="title">Upload an Image</h1>
      <Alert msg={errMsg} type="danger" />
      <Alert msg={successMsg} type="success" />
      <form onSubmit={handleSubmitFile} className="form">
        <input
          id="fileInput"
          type="file"
          name="image"
          onChange={handleFileInputChange}
          value={fileInputState}
          className="form-input"
          accept="image/png"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
      <h1>------------------</h1>
      <Zoom>
        <Image
          cloudName="chaitanya1911"
          publicId="https://res.cloudinary.com/chaitanya1911/image/upload/c_scale,w_500/v2/adaptive_test/Domain/vbnhacfcnijmftvrckck.png"
          width="500"
          crop="scale"
          alt="img"
        ></Image>
      </Zoom>
    </div>
  );
}
