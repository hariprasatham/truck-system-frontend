import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddCompanyModal = ({ show, handleClose, handleSave }) => {
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [isUS, setIsUS] = useState(false);
  const [isCanada, setIsCanada] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    handleSave({
      company_name: companyName,
      description: description,
      is_us: isUS,
      is_canada: isCanada,
    });

    setCompanyName("");
    setDescription("");
    setIsUS(false);
    setIsCanada(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title>Add New Company</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company Region</Form.Label>
            <Form.Check
              type="checkbox"
              label="US"
              checked={isUS}
              onChange={(e) => setIsUS(e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Canada"
              checked={isCanada}
              onChange={(e) => setIsCanada(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
