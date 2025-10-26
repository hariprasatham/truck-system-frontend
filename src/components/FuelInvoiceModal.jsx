// FuelInvoiceModal.jsx
import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

const FuelInvoiceModal = ({ show, onClose, invoice }) => {
  if (!invoice) return null; // no data yet

  return (
    <Modal show={show} onHide={onClose} size="lg" top-centered>
      <Modal.Header closeButton style={{ background: "#e9ecef" }}>
        <Modal.Title style={{ fontSize: "14px", marginBottom: "10px" }}>
          Fuel Invoice Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ fontSize: "12px" }}>
        <Row className="g-2" id="invoiceDetails">
          <Col xs={6}>
            <strong>Truck No:</strong> {invoice.truck_no}
          </Col>
          <Col xs={6}>
            <strong>Truck Type:</strong> {invoice.truck_type}
          </Col>
          <Col xs={6}>
            <strong>Card No:</strong> {invoice.card_no}
          </Col>
          <Col xs={6}>
            <strong>Company:</strong> {invoice.company_name}
          </Col>
          <Col xs={6}>
            <strong>Start Date:</strong> {invoice.start_date}
          </Col>
          <Col xs={6}>
            <strong>End Date:</strong> {invoice.end_date}
          </Col>
          <Col xs={6}>
            <strong>Product Code:</strong> {invoice.product_code || "-"}
          </Col>
          <Col xs={6}>
            <strong>Quantity:</strong> {invoice.quantity}
          </Col>
          <Col xs={6}>
            <strong>Pretax Amt:</strong> {invoice.pretax_amt || "-"}
          </Col>
          <Col xs={6}>
            <strong>GST:</strong> {invoice.gst || "-"}
          </Col>
          <Col xs={6}>
            <strong>HST %:</strong> {invoice.hst || "-"}
          </Col>
          <Col xs={6}>
            <strong>PFT:</strong> {invoice.pft || "-"}
          </Col>
          <Col xs={6}>
            <strong>PST:</strong> {invoice.pst || "-"}
          </Col>
          <Col xs={6}>
            <strong>FET:</strong> {invoice.fet || "-"}
          </Col>
          <Col xs={6}>
            <strong>QST:</strong> {invoice.qst || "-"}
          </Col>
          <Col xs={6}>
            <strong>Final Amount:</strong> {invoice.final_amount}
          </Col>

          <Col xs={12} className="mt-2">
            <Button
              variant="danger"
              size="sm"
              href={invoice.file_path}
              target="_blank"
            >
              <i className="bi bi-file-earmark-pdf"></i> View PDF
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FuelInvoiceModal;
