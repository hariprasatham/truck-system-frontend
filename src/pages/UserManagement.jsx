import React, { useState } from "react";
import "./UserManagement.css";
import AssignMenusModal from "../components/AssignMenusModal";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import AddUserModal from "../components/AddUserModal";
import { Table } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "admin",
      role: "admin",
      status: "active",
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      username: "john_doe",
      role: "safety_engineer",
      status: "inactive",
      createdAt: "2025-02-15",
    },
    {
      id: 3,
      username: "emma",
      role: "safety_engineer",
      status: "active",
      createdAt: "2025-03-20",
    },
  ]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "user",
    status: "active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    if (!newUser.username) {
      alert("Please fill in all required fields");
      return;
    }

    const newUserEntry = {
      id: users.length + 1,
      username: newUser.username,
      role: newUser.role,
      status: newUser.status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [...prev, newUserEntry]);
    setNewUser({ username: "", role: "user", status: "active" });
    setShowAddUserModal(false);
  };

  const {companyId } = useParams();
  const navigate = useNavigate();


  const handleAssignMenu = (id) => {
    setSelectedUserId(id);
    setShowAssignModal(true);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleViewDrivers = (id) => {
    navigate(`/companies/1/user-management/${id}/drivers`);
  };

  return (
    <div className="content flex-grow-1 p-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>
          <i className="bi bi-people me-2"></i> Users in
          <span className="text-primary ms-2">Hari</span>
        </h3>
        <div>
          <button
            className="btn add-user-btn-primary"
            onClick={() => setShowAddUserModal(true)}
          >
            <i className="bi bi-person-plus"></i> Add User
          </button>
          <button className="btn btn-secondary" onClick={()=>navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back to Companies
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">User Management</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <Table className="custom-table table align-middle mb-0">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const statusClass =
                    user.status === "active"
                      ? "status-badge active"
                      : "status-badge inactive";

                  return (
                    <tr key={user.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{user.id}</td>
                      <td className="fw-semibold">{user.username}</td>
                      <td>{user.role.replace("_", " ")}</td>
                      <td>
                        <span className={statusClass}>{user.status}</span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="text-end">
                        {/* Assign menu */}
                        <button
                          className="btn-action"
                          onClick={() => handleAssignMenu(user.id)}
                        >
                          <i className="bi bi-list-check"></i>
                        </button>

                        {/* Activate / Deactivate */}
                        <button
                          className="btn-action"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <i className="bi bi-slash-circle"></i>
                          ) : (
                            <i className="bi bi-check-circle"></i>
                          )}
                        </button>

                        {/* Delete (except admin) */}
                        <button
                          className="btn-action"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                        {/* View Drivers */}
                        <button
                          className="btn-action"
                          onClick={() => handleViewDrivers(user.id)}
                        >
                          <i className="bi bi-truck"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <AssignMenusModal
        show={showAssignModal}
        userId={selectedUserId}
        onClose={() => setShowAssignModal(false)}
      />

      <AddUserModal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        newUser={newUser}
        setNewUser={setNewUser}
        handleInputChange={handleInputChange}
        handleAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;
