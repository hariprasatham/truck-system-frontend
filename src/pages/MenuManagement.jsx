import React, { useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "./MenuManagement.css";
import AddMenuModal from "../components/AddMenuModal";
import EditMenuModal from "../components/EditMenuModal";

const MenuManagement = () => {
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
          <h3 className="mb-0">Menu Management</h3>


        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <i className="bi bi-plus-circle"></i> Add Menu
        </Button>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="table-responsive">
          <Table className="table align-middle custom-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Menu Title</th>
                <th>URL</th>
                <th>Role</th>
                <th>Icon</th>
                <th>Order</th>
                <th>Parent</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td className="fw-semibold">{menu.title}</td>
                  <td>{menu.url}</td>
                  <td>{menu.role}</td>
                  <td>
                    <i className={`${menu.icon} me-2 text-secondary`}></i>
                  </td>
                  <td>{menu.sort_order}</td>
                  <td>{menu.parent_title}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        menu.status === "Active"
                          ? "active" : "inactive"
                      }`}
                    >
                      {menu.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => {
                        setEditData(menu);
                        setShowEdit(true);
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(menu.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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

export default MenuManagement;
