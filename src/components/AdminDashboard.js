import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal"; // Importing Modal from react-bootstrap
import Button from "react-bootstrap/Button"; // Importing Button from react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is included

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // State to hold selected document details

  // Fetch all documents on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    axios
      .get("https://docu-ville-backend.vercel.app/api/doc/documents", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDocuments(response.data))
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  // Update document status, comments, and errors
  const handleSave = (id, status, comments, verificationErrors) => {
    const token = sessionStorage.getItem("token");

    axios
      .put(
        `https://docu-ville-backend.vercel.app/api/doc/documents/${id}/verify`,
        { status, comments, verificationErrors },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => toast.success("Document status updated successfully"))
      .catch((error) => toast.error("Error updating document status"));
  };

  // Function to show document details in modal
  const handleShowDetails = (doc) => {
    setSelectedDocument(doc);
    setShowModal(true);
  };

  // Function to close modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedDocument(null);
  };

  return (
    <div>
      <h2>Admin Dashboard - Document Verification</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Document Name</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Verification Errors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>{doc._id}</td>
              <td>{doc.documentType}</td>
              <td>
                <select
                  defaultValue={doc.status}
                  onChange={(e) => (doc.status = e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={doc.comments}
                  onChange={(e) => (doc.comments = e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  defaultValue={doc.verificationErrors}
                  onChange={(e) => (doc.verificationErrors = e.target.value)}
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    handleSave(
                      doc._id,
                      doc.status,
                      doc.comments,
                      doc.verificationErrors
                    )
                  }
                  className="btn btn-primary"
                >
                  Save
                </button>
                <Button
                  variant="info"
                  onClick={() => handleShowDetails(doc)} // Show full document info
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to display document details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div>
              <p>
                <strong>ID:</strong> {selectedDocument._id}
              </p>
              <p>
                <strong>Document Name:</strong> {selectedDocument.documentType}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {selectedDocument.name || selectedDocument.userId.name}
              </p>{" "}
              {/* Displaying the name from the document */}
              <p>
                <strong>Status:</strong> {selectedDocument.status}
              </p>
              <p>
                <strong>Comments:</strong> {selectedDocument.comments}
              </p>
              <p>
                <strong>Verification Errors:</strong>{" "}
                {selectedDocument.verificationErrors}
              </p>
              <p>
                <strong>Uploaded By:</strong> {selectedDocument.userId.name}{" "}
                (ID: {selectedDocument.userId._id})
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {selectedDocument.dob
                  ? new Date(selectedDocument.dob).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Father's Name:</strong>{" "}
                {selectedDocument.fatherName || "N/A"}
              </p>
              <p>
                <strong>Upload Date:</strong>{" "}
                {new Date(selectedDocument.uploadDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
