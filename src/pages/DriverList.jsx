import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import "./DriverManagement.css";
import AddDriverModal from "../components/AddDriverModal";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import useCompanyDriverStore from "../store/companyDriverStore";
import TableLoader from "../components/TableLoader";
import EditDriverModal from "../components/EditDriverModal";
const DriverList = () => {
  // Dummy driver data
  const { drivers, fetchDriversByCompany, fetchDriverById, deleteDriver, toggleDriverStatus, updateDriver, loading, addDriver, pagination, currentDriver, clearCurrentDriver } = useCompanyDriverStore();


  const { companyId, userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    fetchDriversByCompany(companyId, userId);
  }, [companyId]);

  const [showAddModal, setShowAddModal] = useState(false);
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

  const [showEditModal, setShowEditModal] = useState(false);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "5%",
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
          className={`status-badge ${row.status === "active" ? "active" : "inactive"
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
          <button
            className="btn-action"
            onClick={() => handleDelete(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>


        </>
      ),
    },
  ]

  const handleToggleStatus = async (id, status) => {
    if (status === "active") {
      status = "inactive"
    } else {
      status = "active"
    }
    await toggleDriverStatus(id, status)
    await fetchDriversByCompany(companyId, userId)
  };

  const handleDelete = async (id) => {
    await deleteDriver(id)
    await fetchDriversByCompany(companyId, userId)
  };

  const handleEditDriver = async (id) => {
    try {
      // Clear any previous driver data first
      clearCurrentDriver();

      // Fetch the driver data and wait for it to complete
      const response = await fetchDriverById(id);

      // Use the response data directly instead of relying on store state
      if (response) {
        setNewDriver(response);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error fetching driver:', error);
      // Optionally show an error message to the user
      toast.error('Failed to load driver data');
    }
  };


  const handleUpdateDriver = async () => {
    await updateDriver(newDriver.id, newDriver)
    await fetchDriversByCompany(companyId, userId)
    setShowEditModal(false)
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
    })
  }

  // Add new driver locally
  const handleAddDriver = async () => {

    await addDriver(newDriver)
    await fetchDriversByCompany(companyId, userId)

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
    fetchDriversByCompany(companyId, userId, page)
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchDriversByCompany(companyId, userId, 1, rowsPerPage)
  };

  const handleViewDriver = async (id) => {
        navigate(`/companies/${companyId}/user-management/${userId}/drivers/${id}`);

  }
  return (
    <div className="content my-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h3>
          <i className="bi bi-truck me-2"></i> Drivers of{" "}
          <span className="text-primary">{location?.state?.username}</span>
        </h3>
        <div>
          <Button
            variant="btn add-driver-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-person-plus"></i> Add Driver
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back to Users
          </Button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Drivers</h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <DataTable columns={columns} data={drivers} 
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
            {/* <Table className="custom-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>License</th>
                    <th>Phone</th>
                    <th>Truck No</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{driver.id}</td>
                      <td className="fw-semibold">{driver.name}</td>
                      <td>{driver.license}</td>
                      <td>{driver.phone}</td>
                      <td>{driver.truck_no}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            driver.status === "active" ? "active" : "inactive"
                          }`}
                        >
                          {driver.status.charAt(0).toUpperCase() +
                            driver.status.slice(1)}
                        </span>
                      </td>
                      <td>{driver.email}</td>
                      <td>{driver.address}</td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}
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
    </div>
  );
};

export default DriverList;
