import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import "./DriverManagement.css";
import AddDriverModal from "../components/AddDriverModal";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import useCompanyDriverStore from "../store/companyDriverStore";
import TableLoader from "../components/TableLoader";
import EditDriverModal from "../components/EditDriverModal";
import useUserStore from "../store/userStore";
import toast from "react-hot-toast";
import ImportDrivers from "../components/ImportDrivers";

const DriverManagement = () => {
  // Dummy driver data

  const navigate = useNavigate();
  const location = useLocation();

  const {
    drivers,
    fetchDriversByCompany,
    fetchDriverById,
    deleteDriver,
    toggleDriverStatus,
    updateDriver,
    loading,
    addDriver,
    pagination,
    currentDriver,
    clearCurrentDriver,
    importDrivers,
  } = useCompanyDriverStore();
  const { user } = useUserStore();

  // Derived state
  const role = user?.role;
  const companyId = role === "admin" ? "all" : user?.companyId;
  const userId = role === "admin" ? "all" : user?.userId;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [newDriver, setNewDriver] = useState({
    first_name: "",
    last_name: "",
    license: "",
    expiry_date: "",
    company_id: companyId,
    user_id: userId,
    driver_type: "company_driver",
    status: "active",
    phone: "",
    email: "",
    state: "",
    country: "",
    canadian_hos: "70_7",
    us_hos: "70_8",
    yard_moves: true,
    timezone: "",
    personal_cmv: true,
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch drivers on component mount or when companyId/userId changes
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        await fetchDriversByCompany(companyId, userId);
      } catch (error) {
        toast.error(error.message || "Failed to load drivers");
      }
    };

    loadDrivers();
  }, [companyId, userId, fetchDriversByCompany]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "7%",
    },
    {
      name: "Name",
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      width: "10%",
    },
    {
      name: "License",
      selector: (row) => row.license,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "10%",
      cell: (row) => (
        <span
          className={`status-badge ${
            row.status === "active" ? "active" : "inactive"
          }`}
        >
          {row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1)}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      width: "10%",
      sortable: true,
      cell: (row) => (
        <>
          {/* Activate / Deactivate */}
          <button
            className="btn-action"
            onClick={() => handleToggleStatus(row.id, row.status)}
          >
            {row.status === "active" ? (
              <i className="bi bi-slash-circle"></i>
            ) : (
              <i className="bi bi-check-circle"></i>
            )}
          </button>

          {/* edit */}
          <button
            className="btn-action"
            onClick={() => handleEditDriver(row.id)}
          >
            <i className="bi bi-pencil"></i>
          </button>

          <button
            className="btn-action"
            onClick={() => handleViewDriver(row.id)}
          >
            <i className="bi bi-eye"></i>
          </button>

          {/* Delete (except admin) */}
          <button className="btn-action" onClick={() => handleDelete(row.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  const handleToggleStatus = async (id, status) => {
    try {
      const newStatus = status === "active" ? "inactive" : "active";
      await toggleDriverStatus(id, newStatus);
      await fetchDriversByCompany(companyId, userId);
    } catch (error) {
      console.error("Error toggling driver status:", error);
      toast.error("Failed to toggle driver status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      await fetchDriversByCompany(companyId, userId);
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("Failed to delete driver");
    }
  };
  const handleEditDriver = async (id) => {
    try {
      // Clear any previous driver data first
      clearCurrentDriver();

      // Fetch the driver data and wait for it to complete
      const response = await fetchDriverById(id);

      // Use the response data directly instead of relying on store state
      if (response) {
        response.expiry_date = new Date(response.expiry_date)
          .toISOString()
          .split("T")[0];
        setNewDriver(response);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
      // Optionally show an error message to the user
      toast.error("Failed to load driver data");
    }
  };

  const handleUpdateDriver = async () => {
    try {
      await updateDriver(newDriver.id, newDriver);
      await fetchDriversByCompany(companyId, userId);
      setShowEditModal(false);
      setNewDriver({
        first_name: "",
        last_name: "",
        license: "",
        expiry_date: "",
        company_id: companyId,
        user_id: userId,
        driver_type: "company_driver",
        status: "active",
        phone: "",
        email: "",
        state: "",
        country: "",
        canadian_hos: "70_7",
        us_hos: "70_8",
        yard_moves: true,
        timezone: "",
        personal_cmv: true,
      });
    } catch (error) {
      console.error("Error updating driver:", error);
      toast.error("Failed to update driver");
    }
  };

  // Add new driver locally
  const handleAddDriver = async () => {
    await addDriver(newDriver);
    await fetchDriversByCompany(companyId, userId);

    setNewDriver({
      first_name: "",
      last_name: "",
      license: "",
      expiry_date: "",
      company_id: companyId,
      user_id: userId,
      driver_type: "company_driver",
      status: "active",
      phone: "",
      email: "",
      state: "",
      country: "",
      canadian_hos: "70_7",
      us_hos: "70_8",
      yard_moves: true,
      timezone: "",
      personal_cmv: true,
    });
    setShowAddModal(false);
  };

  const handlePageChange = (page) => {
    fetchDriversByCompany(companyId, userId, page);
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchDriversByCompany(companyId, userId, 1, rowsPerPage);
  };

  const handleViewDriver = async (id) => {
    navigate(`/companies/${companyId}/user-management/${userId}/drivers/${id}`);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      const response = await importDrivers(file);
      console.log(response);
      if (response.errors.length > 0) {
      } else {
        await fetchDriversByCompany(companyId, userId);
        setShowImportModal(false);
      }
    } catch (error) {
      console.error("Error importing drivers:", error);
      toast.error("Failed to import drivers");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <div className="content my-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between mb-3 align-items-center">
        {user.role == "admin" ? (
          <h3>
            <i className="bi bi-truck me-2"></i> All Drivers
          </h3>
        ) : (
          <h3>
            <i className="bi bi-truck me-2"></i> Drivers of{" "}
            <span className="text-primary">{user.username}</span>
          </h3>
        )}
        <div>
          <button
            className="btn add-driver-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-person-plus"></i> Add Driver
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setShowImportModal(true)}
          >
            <i className="bi bi-upload"></i> Import Driver
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card shadow-sm border">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Drivers</h5>
        </div>

        <div className="card-body p-0 rounded-3 overflow-hidden">
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={drivers}
              pagination
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

      {/* Add Driver Modal */}
      <AddDriverModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newDriver={newDriver}
        setNewDriver={setNewDriver}
        handleAddDriver={handleAddDriver}
      />

      {/* Edit Driver Modal */}
      <EditDriverModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        newDriver={newDriver}
        setNewDriver={setNewDriver}
        handleEditDriver={handleUpdateDriver}
        loading={loading}
      />

      <ImportDrivers
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        onSubmit={handleImport}
        onChange={handleFileChange}
        loading={loading}
      />
    </div>
  );
};

export default DriverManagement;
