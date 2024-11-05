import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Doc.css";

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [isImage, setIsImage] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [userDocument, setUserDocument] = useState(null);

  const fetchUserDocument = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          "https://docu-ville-backend.vercel.app/api/doc/user-document",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("here"+response);
        if (response.data.document) setUserDocument(response.data.document);
      } catch (error) {
        console.error(
          "Error fetching user document:",
          error.response?.data || error.message
        );
      }
    }
  };

  useEffect(() => {
    fetchUserDocument();
  }, []);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const isGood = /\.(gif|jpg|png|jpeg)$/i.test(selectedFile.name);
      const isSizeValid = selectedFile.size <= 1024 * 1024;
      if (isGood && isSizeValid) {
        setIsImage(true);
        setImagePreview(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
      } else {
        setIsImage(false);
        setFile(null);
        setImagePreview("");
      }
    }
  };

  const extractTextDetails = (text) => {
    const details = {
      name: null,
      fatherName: null,
      documentType: "PAN Card",
      documentNumber: null,
      dob: null,
    };

    const docNumberRegex = /(COUPC\d+\w?)/; // Adjusted if needed
    const nameRegex = /Name\s*([A-Z\s]+)/;
    const fatherNameRegex = /Father's Name\s*([A-Z\s]+)/;
    const dobRegex = /(\d{2}\/\d{2}\/\d{4})/;

    const docNumberMatch = text.match(docNumberRegex);
    if (docNumberMatch) {
      details.documentNumber = docNumberMatch[0].trim();
    }

    const nameMatch = text.match(nameRegex);
    if (nameMatch) {
      details.name = nameMatch[1].trim();
    }

    const fatherNameMatch = text.match(fatherNameRegex);
    if (fatherNameMatch) {
      details.fatherName = fatherNameMatch[1].trim();
    }

    const dobMatch = text.match(dobRegex);
    if (dobMatch) {
      details.dob = dobMatch[0].trim();
    }

    return details;
  };

  const extractDataFromImage = async (base64File) => {
    const formData = new URLSearchParams();
    formData.append("base64Image", base64File);
    formData.append("apikey", "K85240090388957"); // Your OCR API key
    formData.append("language", "eng");

    try {
      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData
      );
      const data = response.data;

      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage);
      }

      const extractedText = data.ParsedResults[0].ParsedText;
      return extractTextDetails(extractedText);
    } catch (error) {
      console.error("Error during OCR processing:", error);
      throw new Error("Failed to extract text from image.");
    }
  };
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus("Please select an image to upload.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64File = reader.result;
      try {
        const extractedInfo = await extractDataFromImage(base64File);
        const data = {
          extractedInfo,
          documentType: "PAN Card",
        };
        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          "https://docu-ville-backend.vercel.app/api/doc/extract-text",
          data,
          {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          }
        );
        setUploadStatus(response.data.message);
        setFile(null);
        setImagePreview("");
        toast.success("Document uploaded successfully!"); // Success toast
        fetchUserDocument(); // Refresh document display
      } catch (error) {
        console.error("Error uploading document:", error);
        setUploadStatus("Error uploading document.");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setUploadStatus("Error reading file: " + error.message);
    };
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        await axios.delete("https://docu-ville-backend.vercel.app/api/doc/user-document", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDocument(null);
        toast.success("Document deleted successfully!"); // Success toast
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document.");
      }
    }
  };

  return (
    <div className="uploader">
      {userDocument ? (
        <div>
          <h2>Your Uploaded Document</h2>
          <p>Name: {userDocument.name}</p>
          <p>Father's Name: {userDocument.fatherName}</p>
          <p>Document Number: {userDocument.documentNumber}</p>
          <p>Date of Birth: {userDocument.dob}</p>
          <p>Status: {userDocument.status}</p>
          <p>
            Comments: {userDocument.comments || "No comments available"}
          </p>{" "}
          {/* Show comments, or a default message */}
          <p>
            Verification Errors:{" "}
            {userDocument.verificationErrors || "No verification errors"}
          </p>{" "}
          {/* Show verification errors, or a default message */}
          <button onClick={handleDelete} className="btn btn-delete">
            Delete Document
          </button>
        </div>
      ) : (
        <div>
          <h2 className="upload-heading">
            Please Upload Your PAN Card Image Here
          </h2>
          <form
            id="file-upload-form"
            className="uploader"
            onSubmit={handleUpload}
          >
            <input
              id="file-upload"
              type="file"
              name="fileUpload"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload" id="file-drag">
              {file ? (
                <div id="response">
                  <img id="file-image" src={imagePreview} alt="Preview" />
                  <div id="messages">
                    <strong>{file.name}</strong>
                  </div>
                </div>
              ) : (
                <div id="start">
                  <i className="fa fa-download" aria-hidden="true"></i>
                  <div>Select a file or drag here</div>
                  {!isImage && (
                    <div id="notimage">
                      Please select a valid image (PNG, JPG, JPEG) not exceeding
                      1024 KB.
                    </div>
                  )}
                  <span id="file-upload-btn" className="btn btn-primary">
                    Select a file
                  </span>
                </div>
              )}
            </label>
            <button type="submit" className="btn btn-upload" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
