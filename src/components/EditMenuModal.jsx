import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap';

const EditMenuModal = ({ showEdit, setShowEdit, handleEdit, editData, topLevelMenus }) => {
  return (
    
    <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
          <Form onSubmit={handleEdit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body className='row'>
              <Form.Group className="mb-3 col-6">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" defaultValue={editData.title} />
              </Form.Group>
              <Form.Group className="mb-3 col-6">
                <Form.Label>URL</Form.Label>
                <Form.Control name="url" defaultValue={editData.url} />
              </Form.Group>
              <Form.Group className="mb-3 col-6">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" defaultValue={editData.role}>
                  <option value="all">All</option>
                  <option value="admin">Admin</option>
                  <option value="safety_engineer">Safety Engineer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 col-6">
                <Form.Label>Icon</Form.Label>
                <Form.Control name="icon" defaultValue={editData.icon} />
              </Form.Group>
              <Form.Group className="mb-3 col-6">
                <Form.Label>Sort Order</Form.Label>
                <Form.Control
                  type="number"
                  name="sort_order"
                  defaultValue={editData.sort_order}
                />
              </Form.Group>
              <Form.Group className="mb-3 col-6">
                <Form.Label>Parent Menu</Form.Label>
                <Form.Select
                  name="parent_id"
                  defaultValue={editData.parent_id || 0}
                >
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
                Update
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
  )
}

export default EditMenuModal