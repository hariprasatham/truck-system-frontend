import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap';

const AddBrandModal = ({ showAdd, setShowAdd, handleAdd, editData }) => {
  return (
    <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Brand</Modal.Title>
          </Modal.Header>
          <Modal.Body className="row">

            <Form.Group className="col-6 mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" defaultValue={editData.name} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default AddBrandModal