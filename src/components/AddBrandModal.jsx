import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const AddBrandModal = ({ show, setShow, handleSubmit, editData, onReset }) => {
  const [brandName, setBrandName] = useState("");

  // console.log(editData);
  // Pre-fill when editing
  useEffect(() => {
    setBrandName(editData?.name);
  }, [editData]);

  // Capitalize on each change
  const handleNameChange = (e) => {
    const value = e.target.value;

    // Capitalize first letter of each word
    const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());

    setBrandName(capitalized);
  };

  const handleClose = () => {
    onReset();
    setShow(false);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Form
        onSubmit={(e) => {
          e.preventDefault();

          // Inject capitalized name into form before submit
          e.target.name.value = brandName;

          handleSubmit(e);
          onReset();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editData ? "Edit Brand" : "Add New Brand"}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="row">
          <Form.Group className="col-12 mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={brandName}
              onChange={handleNameChange}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="success" type="submit">
            {editData ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddBrandModal;
