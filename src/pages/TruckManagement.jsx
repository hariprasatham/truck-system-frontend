import React, { useState } from "react";
import { Button, Modal, Form, Table, Pagination } from "react-bootstrap";
import "./TruckManagement.css";
import AddTruckModal from "../components/AddTruckModal";
import EditTruckModal from "../components/EditTruckModal";
import DataTable from "react-data-table-component";
import ViewTruckDetails from "../components/ViewTruckDetails";

const TruckManagement = () => {
  // Dummy Equipment Data
  const initialData = [
    {
      id: 1,
      truck_no: "TN 10 AB 1234",
      model: "Tata 407",
      capacity: "3 Tons",
      company_name: "Larsen & Toubro",
      username: "Arun",
      status: "Active",
    },
    {
      id: 2,
      truck_no: "KA 05 CD 5678",
      model: "Ashok Leyland Partner",
      capacity: "5 Tons",
      company_name: "Voltas",
      username: "Vikram",
      status: "Inactive",
    },
    {
      id: 3,
      truck_no: "MH 12 EF 9101",
      model: "Mahindra Blazo",
      capacity: "10 Tons",
      company_name: "JK Infra",
      username: "Ravi",
      status: "Active",
    },
    {
      id: 4,
      truck_no: "TN 22 GH 4321",
      model: "Eicher Pro 3015",
      capacity: "7 Tons",
      company_name: "BHEL",
      username: "Suresh",
      status: "Active",
    },
    {
      id: 5,
      truck_no: "KL 07 IJ 8765",
      model: "BharatBenz 1214R",
      capacity: "9 Tons",
      company_name: "TVS Logistics",
      username: "Karthik",
      status: "Inactive",
    },
  ];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Truck No",
      selector: (row) => row.truck_no,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
            width: "200px",
    },
    {
      name: "Capacity",
      selector: (row) => row.capacity,
      sortable: true,
      width: "100px",
    },
    {
      name: "Company",
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
            width: "120px",
      cell: (row) => (
        <span
          className={`status_badge ${
            row.status === "Active"
              ? "status-badge active"
              : "status-badge inactive"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
        <Button
            size="sm"
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              setViewData(row);
              setShowView(true);
            }}
          >
            <i className="bi bi-eye"></i>
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            className="me-2"
            onClick={() => {
              setEditData(row);
              setShowEdit(true);
            }}
          >
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => setTrucks(trucks.filter((x) => x.id !== row.id))}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </>
      ),
    },
  ];  

  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [trucks, setTrucks] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // Pagination
  const totalPages = Math.ceil(trucks.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = trucks.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Add Equipment
  const handleAdd = (e) => {
    e.preventDefault();
    const form = e.target;
    const newTruck = {
      id: Date.now(),
      truck_no: form.truck_no.value,
      model: form.model.value,
      capacity: form.capacity.value,
      company_name: form.company_name.value,
      username: form.username.value,
      status: form.status.value,
    };
    setTrucks([...trucks, newTruck]);
    setShowAdd(false);
  };

  // Edit Equipment
  const handleEdit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = trucks.map((truck) =>
      truck.id === editData.id
        ? {
            ...truck,
            truck_no: form.truck_no.value,
            model: form.model.value,
            capacity: form.capacity.value,
            company_name: form.company_name.value,
            username: form.username.value,
            status: form.status.value,
          }
        : truck
    );
    setTrucks(updated);
    setShowEdit(false);
  };

  return (
    <div className="content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 ms-3">Equipment Management</h3>
        <div className="d-flex align-items-center gap-2">
          <Button variant="success" onClick={() => setShowAdd(true)}>
            <i className="bi bi-plus-circle"></i> Add Equipment
          </Button>
          <Button variant="primary">
            <i className="bi bi-upload"></i> Import Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={currentData}
            noHeader
            pagination={true}
          />

        </div>
      </div>

      <ViewTruckDetails 
        open={showView}
        onClose={() => setShowView(false)}
        truck={viewData}
      />

      {/* Add Equipment Modal */}
      <AddTruckModal 
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        handleAdd={handleAdd}
      />

      {/* Edit Equipment Modal */}
      {editData && (
        <EditTruckModal 
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          handleEdit={handleEdit}
          editData={editData}
        />
      )}
    </div>
  );
};

export default TruckManagement;
