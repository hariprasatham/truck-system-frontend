import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap';

const AddMenuModal = ({ showAdd, setShowAdd, handleAdd, topLevelMenus }) => {
  return (
    <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Form onSubmit={handleAdd}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body className="row">

            <Form.Group className="col-6 mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" required />
            </Form.Group>
            <Form.Group className="col-6 mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control name="url" />
            </Form.Group>
            <Form.Group className="col-6 mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role">
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="safety_engineer">Safety Engineer</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-6 mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control name="icon" placeholder="bi bi-truck" />
            </Form.Group>
            <Form.Group className="col-6 mb-3">
              <Form.Label>Sort Order</Form.Label>
              <Form.Control type="number" name="sort_order" defaultValue="0" />
            </Form.Group>
            <Form.Group className="col-6 mb-3">
              <Form.Label>Parent Menu</Form.Label>
              <Form.Select name="parent_id">
                <option value="0">-- None (Top Level) --</option>
                    {topLevelMenus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.title}
                      </option>
                    ))}
              </Form.Select>
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

export default AddMenuModal