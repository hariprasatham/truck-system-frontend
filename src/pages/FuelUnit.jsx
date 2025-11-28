import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Modal, Button, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";

import useCompanyDriverStore from "../store/companyTruckStore";
import FuelUnitList from "./FuelUnitList";

const FuelUnit = () => {
  const [fileModal, setFileModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [file, setFile] = useState(null);

  const { uploadFuelUnits, loading } = useCompanyDriverStore();

  // --------------------
  // OPEN / CLOSE MODALS
  // --------------------
  const openUploadPopup = () => setFileModal(true);
  const closeUploadPopup = () => setFileModal(false);

  // --------------------
  // HELPER FUNCTIONS
  // --------------------
  // Convert Excel serial number to JS Date
  const excelDateToJSDate = (excelDate) =>
    new Date((excelDate - 25569) * 86400 * 1000);

  // Format JS Date to readable string (DD Month YYYY)
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return date; // if invalid, return original
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // --------------------
  // FILE UPLOAD HANDLING
  // --------------------
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error("Please upload only CSV or Excel file");
      return;
    }
    // Validate filename pattern: must start with 'Unit_'
    const fileNamePattern = /^Unit_(\d+)_/i;
    const match = uploadedFile.name.match(fileNamePattern);

    if (!match) {
      toast.error(
        "Invalid file name. File name must start with 'Unit_' followed by unit number."
      );
      return;
    }

    const unitNumber = match[1];

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      let json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Format 'Trip Date' column and skip invalid rows
      json = json
        .map((row) => {
          const tripDate = row["Trip Date"];
          let formatted = "";
          if (tripDate) {
            formatted =
              typeof tripDate === "number"
                ? formatDate(excelDateToJSDate(tripDate))
                : formatDate(tripDate);
          }
          return {
            ...row,
            "Trip Date": formatted,
            unit_no: unitNumber,
          };
        })
        .filter((row) => row["Trip Date"]); // skip rows without valid Trip Date

      if (json.length === 0) {
        toast.error("No valid Trip Date rows found.");
        return;
      }

      setPreviewData(json);
      setFileModal(false);
      setPreviewModal(true);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  // --------------------
  // UPLOAD TO SERVER
  // --------------------
  const handleUploadToServer = async () => {
    if (previewData.length === 0) return;

    try {
      await uploadFuelUnits(previewData);

      toast.success("Fuel units uploaded successfully!");
      setPreviewModal(false); // close modal after success
      setPreviewData([]);
      setFile(null);
    } catch (err) {
      const message = err.response?.data?.message || "Upload failed";
      toast.error(message);
    }
  };

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Fuel Unit</h3>
        <Button variant="primary" onClick={openUploadPopup}>
          <i className="bi bi-plus-circle"></i> Add Fuel Unit
        </Button>
      </div>
      <FuelUnitList />

      {/* Choose File Modal */}
      <Modal show={fileModal} onHide={closeUploadPopup} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Fuel Unit File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please upload a CSV or Excel (.xlsx) file.</p>
          <input
            type="file"
            accept=".csv, .xlsx"
            className="form-control"
            onChange={handleFileChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUploadPopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Data Modal */}
      <Modal
        show={previewModal}
        onHide={() => setPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Preview Fuel Unit Data
            {file && (
              <span
                style={{
                  fontSize: "0.9rem",
                  marginLeft: "10px",
                  color: "#555",
                }}
              >
                ({file.name})
              </span>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewData.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered>
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No data found in file.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleUploadToServer}
            disabled={loading} // disable while uploading
          >
            {loading ? "Uploading..." : "Upload to Server"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FuelUnit;
