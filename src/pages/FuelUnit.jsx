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

  const { uploadFuelUnits, loading, uploadJurisdictionData } =
    useCompanyDriverStore();

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

    const fileName = uploadedFile.name;

    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error("Please upload only CSV or Excel file");
      return;
    }

    // Allow Unit_### or Jurisdiction_
    const filenameRegex =
      /^(Unit_(\d+)_Summary|Jurisdiction_Summary)_(\d{4})-(\d{2})_(\d{4})-(\d{2})(?:.*)\.(csv|xlsx)$/i;

    const match = fileName.match(filenameRegex);

    if (!match) {
      toast.error(
        "Invalid filename. Expected:\n" +
          "Unit_134_Summary_2025-01_2025-03.csv\n" +
          "Jurisdiction_Summary_2025-01_2025-03.csv"
      );
      return;
    }

    const isUnitFile = match[1].startsWith("Unit_");
    const unitNumber = isUnitFile ? match[2] : null;

    const startYear = match[3];
    const startMonth = parseInt(match[4], 10);
    const endYear = match[5];
    const endMonth = parseInt(match[6], 10);

    const validQuarters = [
      { start: 1, end: 3 },
      { start: 4, end: 6 },
      { start: 7, end: 9 },
      { start: 10, end: 12 },
    ];

    const isQuarterValid = validQuarters.some(
      (q) =>
        startMonth === q.start && endMonth === q.end && startYear === endYear
    );

    if (!isQuarterValid) {
      toast.error("Invalid quarter. File must be a full quarter.");
      return;
    }

    setFile(uploadedFile);

    // PARSE CONTENT
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      let json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // ------------------------------------
      // 1️⃣ UNIT FILE → KEEP YOUR OLD LOGIC
      // ------------------------------------
      if (isUnitFile) {
        // Remove any rows where Trip Date is missing or is "Overall Totals"
        const unitRows = json
          .filter(
            (row) =>
              row["Trip Date"] &&
              row["Trip Date"].toString().trim().toLowerCase() !==
                "overall totals" &&
              row["Trip Date"].toString().trim().toLowerCase() !== "total"
          )
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
          .filter((row) => row["Trip Date"]);

        if (unitRows.length === 0) {
          toast.error("No valid Trip Date rows found.");
          return;
        }

        // Set period at top level, not inside each row
        setPreviewData({
          file_type: "UNIT",
          period_start: `${startYear}-${String(startMonth).padStart(
            2,
            "0"
          )}-01`,
          period_end: `${endYear}-${String(endMonth).padStart(2, "0")}-01`,
          rows: unitRows,
        });

        setFileModal(false);
        setPreviewModal(true);
        return;
      }

      // ----------------------------
      // 2️⃣ JURISDICTION PARSING
      // ----------------------------
      else {
        // Remove totals row
        json = json.filter(
          (row) =>
            row["Vehicle"] &&
            row["Vehicle"].toString().trim().toLowerCase() !== "overall totals"
        );

        if (json.length === 0) {
          toast.error("No jurisdiction rows found.");
          return;
        }

        // Extract dynamic state columns (everything except Vehicle + Total)
        const allColumns = Object.keys(json[0]);
        const stateColumns = allColumns.filter(
          (col) => col !== "Vehicle" && col !== "Total"
        );

        // Convert into structured data
        const jurisdictionFormatted = json.map((row) => {
          const states = {};
          stateColumns.forEach((state) => {
            const val = row[state];
            states[state] = val === "-" || val === "" ? 0 : val;
          });

          return {
            vehicle: row["Vehicle"],
            total: row["Total"] || 0,
            states,
            file_type: "JURISDICTION",
          };
        });

        // ⬇️ ADD THE PERIOD FROM FILENAME
        setPreviewData({
          period_start: `${startYear}-${String(startMonth).padStart(
            2,
            "0"
          )}-01`,
          period_end: `${endYear}-${String(endMonth).padStart(2, "0")}-01`,
          rows: jurisdictionFormatted,
          file_type: "JURISDICTION",
        });

        setFileModal(false);
        setPreviewModal(true);
      }

      setFileModal(false);
      setPreviewModal(true);
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  // --------------------
  // UPLOAD TO SERVER
  // --------------------
  const handleUploadToServer = async () => {
    if (previewData.length == 0) {
      toast.error("No data to upload.");
      return;
    }

    try {
      let payload;
      let response;

      // ---------------------------------
      // 1️⃣ UNIT FILE → Array format
      // ---------------------------------
      if (previewData.file_type === "UNIT") {
        payload = {
          file_type: "UNIT",
          period_start: previewData.period_start,
          period_end: previewData.period_end,
          rows: previewData.rows,
        };

        // console.log("Uploading UNIT:", payload);
        response = await uploadFuelUnits(payload);
        fetchFuelUnits();

        toast.success("Unit data uploaded successfully!");
      }

      // ---------------------------------
      // 2️⃣ JURISDICTION FILE → Object format
      // ---------------------------------
      else if (previewData.file_type === "JURISDICTION") {
        payload = {
          file_type: "JURISDICTION",
          period_start: previewData.period_start,
          period_end: previewData.period_end,
          data: previewData.rows,
        };

        // console.log(payload, "mypayload");
        // 👉 CALL YOUR ZUSTAND API
        response = await uploadJurisdictionData(payload);
        fetchFuelUnits();
        if (res?.message) {
          toast.success(
            `${res.message} Inserted: ${res.inserted}, Duplicates Skipped: ${res.skipped_duplicates}`
          );
        } else {
          toast.success("Jurisdiction data uploaded successfully!");
        }
        // toast.success("Jurisdiction data uploaded successfully!");
      } else {
        toast.error("Invalid preview data format.");
        return;
      }

      // console.log("Upload response:", response);

      // Reset state
      setPreviewModal(false);
      setPreviewData(null);
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
          {previewData ? (
            <div className="table-responsive">
              {/* Show period on top */}
              {previewData.period_start && previewData.period_end && (
                <p>
                  <strong>Period:</strong> {previewData.period_start} →{" "}
                  {previewData.period_end}
                </p>
              )}

              {/* UNIT TABLE */}
              {previewData.file_type === "UNIT" &&
                previewData.rows?.length > 0 && (
                  <Table striped bordered>
                    <thead>
                      <tr>
                        {Object.keys(previewData.rows[0]).map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}

              {/* JURISDICTION TABLE */}
              {previewData.file_type === "JURISDICTION" &&
                previewData.rows?.length > 0 && (
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Vehicle</th>
                        <th>Total</th>
                        {Object.keys(previewData.rows[0].states).map(
                          (st, i) => (
                            <th key={i}>{st}</th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {previewData.rows.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.vehicle}</td>
                          <td>{row.total}</td>
                          {Object.values(row.states).map((val, i) => (
                            <td key={i}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
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
