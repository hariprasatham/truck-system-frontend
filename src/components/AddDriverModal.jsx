import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const AddDriverModal = ({ showAddModal, setShowAddModal, newDriver, setNewDriver, handleChange, handleAddDriver }) => {
  return (
    <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row g-3">
          {[
            { label: "Name", name: "name" },
            { label: "License", name: "license" },
            { label: "Phone", name: "phone" },
            { label: "Truck No", name: "truck_no" },
            { label: "Email", name: "email" },
            { label: "Address", name: "address" },
          ].map((field) => (
            <div className="col-6  mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input
                type="text"
                className="form-control"
                name={field.name}
                value={newDriver[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={newDriver.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <button className="btn btn-success" onClick={handleAddDriver}>
            Add Driver
          </button>
        </Modal.Footer>
      </Modal>
  )
}

export default AddDriverModal