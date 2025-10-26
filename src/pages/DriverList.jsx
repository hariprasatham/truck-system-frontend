import React, { useState } from "react";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import "./DriverManagement.css";
import AddDriverModal from "../components/AddDriverModal";
import { useParams, useNavigate } from "react-router-dom";
const DriverList = ({ username = "JohnDoe" }) => {
  // Dummy driver data
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Arun Kumar",
      license: "TN45 2024 345678",
      phone: "9876543210",
      truck_no: "TN45 AB 1234",
      status: "active",
      email: "arun.kumar@example.com",
      address: "Coimbatore, Tamil Nadu",
    },
    {
      id: 2,
      name: "Vijay R",
      license: "TN38 2023 987654",
      phone: "9956234789",
      truck_no: "TN38 CD 6789",
      status: "inactive",
      email: "vijay.r@example.com",
      address: "Erode, Tamil Nadu",
    },
    {
      id: 3,
      name: "Karthick P",
      license: "KA12 2022 456789",
      phone: "9845012345",
      truck_no: "KA12 EF 2468",
      status: "active",
      email: "karthick.p@example.com",
      address: "Bengaluru, Karnataka",
    },
  ]);

  const {companyId, userId} = useParams();
  const navigate = useNavigate();

  console.log("Params in DriverManagement:", {companyId, userId});

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    license: "",
    phone: "",
    truck_no: "",
    status: "active",
    email: "",
    address: "",
  });

  // Handle input change for new driver
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDriver((prev) => ({ ...prev, [name]: value }));
  };

  // Add new driver locally
  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.license) {
      alert("Please fill in all required fields");
      return;
    }
    const newEntry = {
      ...newDriver,
      id: drivers.length + 1,
    };
    setDrivers((prev) => [...prev, newEntry]);
    setNewDriver({
      name: "",
      license: "",
      phone: "",
      truck_no: "",
      status: "active",
      email: "",
      address: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="container my-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between mb-3 align-items-center">
        <h3>
          <i className="bi bi-truck me-2"></i> Drivers of{" "}
          <span className="text-primary">{username}</span>
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

        <div className="card-body">
          {drivers.length > 0 ? (
            <div className="table-responsive">
              <Table className="custom-table">
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
              </Table>
            </div>
          ) : (
            <p className="text-danger m-3">No drivers found for this user.</p>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newDriver={newDriver}
        setNewDriver={setNewDriver}
        handleChange={handleChange}
        handleAddDriver={handleAddDriver}
      />
    </div>
  );
};

export default DriverList;
