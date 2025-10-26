import React, { useState, useEffect } from "react";

const AssignMenusModal = ({ show, onClose, userId }) => {
  const [selectedMenus, setSelectedMenus] = useState([]);

  const menus = [
    { name: "Reports", icon: "bi bi-file-earmark-bar-graph" },
    { name: "Menu Management", icon: "bi bi-link-45deg" },
    { name: "Dashboard", icon: "bi bi-speedometer2" },
    { name: "Companies", icon: "bi bi-building" },
    { name: "Drivers", icon: "bi bi-file-earmark-person" },
    { name: "Test", icon: "bi bi-truck" },
    { name: "Truck", icon: "bi bi-truck" },
    { name: "Fuel Invoice", icon: "bi bi-file-earmark-bar-graph" },
    { name: "Pre Employment Check", icon: "bi bi-file-earmark-bar-graph" },
  ];

  // Simulate previously assigned menus for the user
  useEffect(() => {
    if (userId) {
      setSelectedMenus(["Dashboard", "Reports"]);
    }
  }, [userId]);

  const handleCheckboxChange = (menuName) => {
    setSelectedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((m) => m !== menuName)
        : [...prev, menuName]
    );
  };

  const handleSave = () => {
    console.log(`✅ Menus assigned to User ${userId}:`, selectedMenus);
    onClose();
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={show ? { background: "rgba(0,0,0,0.5)" } : {}}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-list-check me-2"></i>Assign Menus
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p className="mb-3 text-muted">
              Assign access menus for <strong>User ID {userId}</strong>
            </p>

            <ul className="list-group">
              {menus.map((menu, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className={`${menu.icon} text-success`}></i>
                    <span>{menu.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedMenus.includes(menu.name)}
                    onChange={() => handleCheckboxChange(menu.name)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignMenusModal;
