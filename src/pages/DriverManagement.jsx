
import React, { useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "./DriverManagement.css";
import AddMenuModal from "../components/AddMenuModal";
import EditMenuModal from "../components/EditMenuModal";

import DataTable from "react-data-table-component";

const DriverManagement = () => {
  // Dummy Data
  const [menus, setMenus] = useState([
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard",
      role: "admin",
      icon: "bi bi-speedometer2",
      sort_order: 1,
      parent_id: 0,
      parent_title: "Top Level",
      status: "Active",
    },
    {
      id: 2,
      title: "Users",
      url: "/users",
      role: "all",
      icon: "bi bi-people",
      sort_order: 2,
      parent_id: 0,
      parent_title: "Top Level",
      status: "Inactive",
    },
    {
      id: 3,
      title: "Settings",
      url: "/settings",
      role: "admin",
      icon: "bi bi-gear",
      sort_order: 3,
      parent_id: 0,
      parent_title: "Top Level",
      status: "Active",
    },
  ]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "100px",
    },
    {
      name: "License No",
      selector: (row) => row.license_no,
      sortable: true,
      width: "100px",
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      sortable: true,
      width: "100px",
    },
    {
      name: "Assigned Truck",
      selector: (row) => row.assigned_truck,
      sortable: true,
      width: "100px",
    },
    {
      name: "Status",
      selector: (row) => row.status ,
            cell: (row) => (
        <span
          className={`status_badge ${
            row .status === "Active"
              ? "status-badge active"
              : "status-badge inactive"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
        width: "120px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
        width: "150px",
    },
    {
        name: "Actions",
        cell: (row) => (
          <>
            <Button size="sm" variant="outline-primary" className="me-2">
              <i className="bi bi-pencil"></i>
            </Button>
            <Button size="sm" variant="outline-primary" className="me-2">
              <i className="bi bi-eye"></i>
            </Button>
            <Button size="sm" variant="outline-primary" className="me-2">
              <i className="bi bi-eye"></i> License
            </Button>
            <Button size="sm" variant="outline-primary" className="me-2 btn-secondary">
              <i className="bi bi-eye"></i> View License
            </Button>
            <Button size="sm" variant="outline-danger" className="me-2">
              <i className="bi bi-trash"></i>
            </Button>
          </>
        )
      }
  ];    

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "John Doe",
      license_no: "DL1234567890",
      contact: "9876543210",
      assigned_truck: "TN 10 AB 1234",
      status: "Active",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      license_no: "DL0987654321",
      contact: "8765432109",
      assigned_truck: "KA 05 CD 5678",
      status: "Inactive",
      email: "jane.smith@example.com",
    },
  ]);   

  

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const [topLevelMenus, setTopLevelMenus] = useState(
    menus.filter((menu) => menu.parent_id === 0)
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this menu?")) {
      setMenus(menus.filter((menu) => menu.id !== id));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newMenu = {
      id: Date.now(),
      title: e.target.title.value,
      url: e.target.url.value,
      role: e.target.role.value,
      icon: e.target.icon.value,
      sort_order: Number(e.target.sort_order.value),
      parent_id: Number(e.target.parent_id.value),
      parent_title: e.target.parent_id.value === "0" ? "Top Level" : "Parent",
      status: e.target.role.value === "admin" ? "Active" : "Inactive",
    };
    setMenus([...menus, newMenu]);
    setShowAdd(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setMenus(
      menus.map((menu) =>
        menu.id === editData.id
          ? {
              ...menu,
              title: e.target.title.value,
              url: e.target.url.value,
              role: e.target.role.value,
              icon: e.target.icon.value,
              sort_order: Number(e.target.sort_order.value),
              parent_id: Number(e.target.parent_id.value),
              parent_title:
                e.target.parent_id.value === "0" ? "Top Level" : "Parent",
              status: e.target.role.value === "admin" ? "Active" : "Inactive",
            }
          : menu
      )
    );
    setShowEdit(false);
  };

  return (
    <div className="content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Driver Management</h3>


        <div className="d-flex align-items-center gap-2">
            <Button variant="btn add-btn-primary" onClick={() => setShowAdd(true)}>
              <i className="bi bi-plus-circle"></i> Add Driver
            </Button>
            <Button variant="btn btn-secondary" onClick={() => setShowAdd(true)}>
              <i className="bi bi-file-earmark-spreadsheet"></i> Import Drivers
            </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="table-responsive">
            <DataTable
              columns={columns}
              data={drivers}
              pagination
              highlightOnHover
              pointerOnHover
            />
        </div>
      </div>

      {/* Add Menu Modal */}
      <AddMenuModal showAdd={showAdd} setShowAdd={setShowAdd} handleAdd={handleAdd} topLevelMenus={topLevelMenus} />

      {/* Edit Menu Modal */}
      {editData && (
        <EditMenuModal showEdit={showEdit} setShowEdit={setShowEdit} handleEdit={handleEdit} editData={editData} topLevelMenus={topLevelMenus} />
      )}
    </div>
  );
};

export default DriverManagement;
