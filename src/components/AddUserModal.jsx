import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const AddUserModal = ({ show, onHide, newUser, setNewUser, handleInputChange, handleAddUser }) => {
  return (
    <Modal id="addUserModal" tabIndex="-1" show={show} onHide={onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="safety_engineer">Safety Engineer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Cancel
              </Button>
              <button variant='' className='btn btn-success' onClick={handleAddUser}>
                Add User
              </button>
            </Modal.Footer>
      </Modal>
  )
}

export default AddUserModal