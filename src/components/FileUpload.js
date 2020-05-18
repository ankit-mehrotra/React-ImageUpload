import React from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

export default function FileUpload() {
  const [file, setFile] = React.useState("");
  const [fileName, setFileName] = React.useState("Choose File");
  const [uploadedFile, setUploadedFile] = React.useState({});
  const [alertMsg, setAlertMsg] = React.useState("");
  const [uploadPer, setUploadPer] = React.useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const {
        data: { fileName, filePath },
      } = await axios.post("http://localhost:4000/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPer(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
          setTimeout(() => {
            setUploadPer(0);
          }, 10000);
        },
      });

      setUploadedFile({ fileName, filePath });
      setFileName("");
      setAlertMsg("SuccessFully Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setAlertMsg("Problem with server");
      } else {
        setAlertMsg(err);
      }
    }
  };

  return (
    <>
      {alertMsg && <Message msg={alertMsg} />}
      <form onSubmit={handleSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={handleFileChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>
        <Progress percentage={uploadPer} />
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {uploadedFile && (
        <div className="row mt-4">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img src={uploadedFile.filePath} alt="" style={{ width: "100%" }} />
          </div>
        </div>
      )}
    </>
  );
}
