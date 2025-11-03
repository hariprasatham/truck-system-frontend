import React from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap';
const ViewTruckDetails = ({open, onClose, truck}) => {

  const handleClose = () => onClose();

  return (
    <Modal show={open} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Truck Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {truck ? (
          <div>
            <p><strong>Truck No:</strong> {truck.truck_no}</p>
            <p><strong>Brand:</strong> {truck.truck_brand}</p>
            <p><strong>Type:</strong> {truck.truck_type}</p>
            <p><strong>Trailer:</strong> {truck.trailer_type}</p>
            <p><strong>Equipment:</strong> {truck.equipment_type}</p>
            <p><strong>Model:</strong> {truck.model}</p>
            <p><strong>Capacity:</strong> {truck.capacity}</p>
            <p><strong>Status:</strong> {truck.status}</p>
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
  )
}

export default ViewTruckDetails
  