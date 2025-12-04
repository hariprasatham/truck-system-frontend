import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const MedicalReviewModal = ({reviewData, show, handleClose}) => {


    console.log("reviewData", reviewData)

  const fields = [
    { label: "Lab Account", key: "lab_account" },
    { label: "Donor Name", key: "donor_name" },
    { label: "Donor ID", key: "donor_id" },
    { label: "Reason for Test", key: "reason_for_test" },
    { label: "Regulated Test", key: "regulated_test" },
    { label: "Specimen ID", key: "specimen_id" },
    { label: "Lab Accession", key: "lab_accession" },
    { label: "Collection Date", key: "collection_date" },
    { label: "Lab Received Date", key: "lab_received_date" },
    { label: "Lab Released Date", key: "lab_released_date" },
    { label: "MRO Date CCF2", key: "mro_date_ccf2" },
    { label: "MRO Verification Date", key: "mro_verification_date" },
    { label: "MRO Report Date", key: "mro_report_date" },
    { label: "Overall Verification", key: "overall_verification" },
  ];

  const formatValue = (key, value) => {
  const dateFields = [
    "collection_date",
    "lab_received_date",
    "lab_released_date",
    "mro_date_ccf2",
    "mro_verification_date",
    "mro_report_date"
  ];
  
  if (dateFields.includes(key) && value) {
    return new Date(value).toLocaleDateString("en-GB");
  }
  return value || "-";
};


  return (
    <div className="p-3">
      <Modal show={show} onHide={handleClose} size="lg" top-centered>
        <Modal.Header closeButton>
          <Modal.Title>Medical Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewData ? (
            <div className="container-fluid">
              <Row className="g-3">
                {fields.map((f) => (
                  <Col md={6} key={f.key}>
                    <small className="text-muted">{f.label}:</small>
                    <br />
                    <span className="fw-semibold small">
                      {formatValue(f.key, reviewData[f.key])}
                    </span>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <p className="text-muted">No data available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MedicalReviewModal;
