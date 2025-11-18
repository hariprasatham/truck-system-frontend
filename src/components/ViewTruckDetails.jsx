import React from "react";
import { Modal, Button, Spinner, Row, Col } from "react-bootstrap";
const ViewTruckDetails = ({ open, onClose, truck }) => {
  const handleClose = () => onClose();

  return (
    <Modal show={open} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Truck Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {truck ? (
          <div>
            <Row>
              <InfoBox label="Truck No" value={truck.truck_no} />
              <InfoBox label="Brand" value={truck.truck_brand} />
              <InfoBox label="Sub Type" value={truck.sub_type} />
              <InfoBox label="Model" value={truck.model} />
            </Row>

            <Row>
              <InfoBox label="Status" value={truck.status} />
              <InfoBox label="Ownership" value={truck.truck_ownership} />
              <InfoBox label="User" value={truck.user.username} />
              <InfoBox label="Company" value={truck.company.company_name} />
            </Row>

            <Row>
              <InfoBox label="Equipment" value={truck.equipment_type} />
              <InfoBox label="Vin Number" value={truck.vin_number} />
              <InfoBox label="Capacity" value={truck.capacity} />
              <InfoBox
                label="Created At"
                value={
                  truck.created_at
                    ? new Date(truck.createdAt).toLocaleDateString()
                    : "-"
                }
              />
              {/* <InfoBox label="" value="" /> */}
            </Row>
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const InfoBox = ({ label, value }) => (
  <Col className="mb-3">
    <div className="fw-normal text-muted fs-6">{label}</div>
    <div className="fw-semibold fs-6">{value || "-"}</div>
  </Col>
);

export default ViewTruckDetails;
