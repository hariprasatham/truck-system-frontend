import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import AssignMenusModal from "../components/AssignMenusModal";
import { useNavigate, useParams } from "react-router-dom";
import AddUserModal from "../components/AddUserModal";

import useCompanyUsersStore from "../store/companyUsersStore";
import useUserStore from "../store/userStore";
import DataTable from "react-data-table-component";
import TableLoader from "../components/TableLoader";
import useMenuStore from "../store/menuStore";

const UserManagement = () => {

  const { users, fetchUsersByCompany, pagination, addUserToCompany, changeUserActiveStatus, removeUserFromCompany, loading } = useCompanyUsersStore();
  const { user } = useUserStore();
  const { clearAssignedMenus, message } = useMenuStore();


  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "safety_engineer",
    status: "active",
  });


  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`status_badge ${row.status === "active"
            ? "status-badge active"
            : "status-badge inactive"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at ? new Date(row.created_at).toLocaleString() : "",
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      sortable: true,
      cell: (row) => (
        <>
          <button
            className="btn-action"
            onClick={() => handleAssignMenu(row.id)}
          >
            <i className="bi bi-list-check"></i>
          </button>

          {/* Activate / Deactivate */}
          <button
            className="btn-action"
            onClick={() => handleToggleStatus(row.id)}
          >
            {row.status === "active" ? (
              <i className="bi bi-slash-circle"></i>
            ) : (
              <i className="bi bi-check-circle"></i>
            )}
          </button>

          {/* Delete (except admin) */}
          <button
            className="btn-action"
            onClick={() => handleDelete(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>

          {/* View Drivers */}
          <button
            className="btn-action"
            onClick={() => handleViewDrivers(row.id, row.username)}
          >
            <i className="bi bi-people"></i>
          </button>
          {/* View Trucks */}
          <button
            className="btn-action"
            onClick={() => handleViewTrucks(row.id, row.username)}
          >
            <i className="bi bi-truck"></i>
          </button>
        </>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    await addUserToCompany(companyId, newUser);
    await fetchUsersByCompany(companyId)
    setShowAddUserModal(false);
  };

  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersByCompany(companyId);
  }, [companyId]);


  const handleAssignMenu = async (id) => {
    setSelectedUserId(id);
    setShowAssignModal(true);

  };


  const handleViewTrucks = (id, username) => {
    navigate(`/companies/${companyId}/user-management/${id}/trucks`, { state: { username } });
  };

  const handleToggleStatus = async (id) => {
    await changeUserActiveStatus(companyId, id)
    await fetchUsersByCompany(companyId)
  };

  const handleDelete = async (id) => {
    await removeUserFromCompany(companyId, id)
    await fetchUsersByCompany(companyId)
  };

  const handleViewDrivers = (id, username) => {
    navigate(`/companies/${companyId}/user-management/${id}/drivers`, { state: { username } });
  };

  const handlePageChange = (page) => {
    fetchUsersByCompany(companyId, { page });
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchUsersByCompany(companyId, { limit: rowsPerPage });
  };

  const handleAddUserModalClose = () => {
    setShowAddUserModal(false);
    setNewUser({
      username: "",
      role: "safety_engineer",
      status: "active",
    });
  };

  const handleAssignMenuClose = () => {
    setShowAssignModal(false);
    setSelectedUserId(null);
    clearAssignedMenus();


  };

  return (
    <div className="content flex-grow-1 p-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>
          <i className="bi bi-people me-2"></i> Users in
          <span className="text-primary ms-2">{user?.username}</span>
        </h3>
        <div>
          <button
            className="btn add-user-btn-primary"
            onClick={() => setShowAddUserModal(true)}
          >
            <i className="bi bi-person-plus"></i> Add User
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
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
            <DataTable
              columns={columns}
              data={users}
              pagination={true}
              paginationServer={true}
              paginationTotalRows={pagination.total}
              paginationRowsPerPage={pagination.limit}
              paginationRowsPerPageOptions={[5, 10, 20]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              progressPending={loading}
              progressComponent={<TableLoader />}
            />
          </div>
        </div>
      </div>

      <AssignMenusModal
        show={showAssignModal}
        userId={selectedUserId}
        onClose={() => handleAssignMenuClose()}
      />

      <AddUserModal
        show={showAddUserModal}
        onHide={() => handleAddUserModalClose()}
        newUser={newUser}
        setNewUser={setNewUser}
        handleInputChange={handleInputChange}
        handleAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;
