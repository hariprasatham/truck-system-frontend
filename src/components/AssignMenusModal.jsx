import React, { useState, useEffect } from "react";
import useMenuStore from "../store/menuStore";
const AssignMenusModal = ({ show, onClose, selectedUser }) => {
  const [selectedMenus, setSelectedMenus] = useState([]);
  const {
    fetchAssignedMenus,
    assignedMenus,
    allMenusForAssignment,
    updateUserMenus,
    error,
  } = useMenuStore();

  // Simulate previously assigned menus for the user
  useEffect(() => {
    const loadAssignedMenus = async () => {
      if (!selectedUser) return;

      try {
        await fetchAssignedMenus(selectedUser?.id);
        // Use the response directly to avoid race conditions
      } catch (error) {
        console.error("Error loading assigned menus:", error);
      }
    };

    loadAssignedMenus();
  }, [selectedUser]);

  useEffect(() => {
    setSelectedMenus(assignedMenus.map((menu) => menu.id));
  }, [assignedMenus]);

  const handleCheckboxChange = (menuId) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((m) => m !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSave = async () => {
    try {
      await updateUserMenus(selectedUser?.id, selectedMenus);
      if (!error) {
        onClose();
        setSelectedMenus([]);
      }
    } catch (error) {
      console.error("Error updating user menus:", error);
    }
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
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <p className="mb-3 text-muted">
              Assign access menus for User<strong> {selectedUser?.username}</strong>
            </p>
            {error && <div className="alert alert-danger">{error}</div>}

            <ul className="list-group">
              {allMenusForAssignment
                .filter((menu) => menu.role != "admin")
                .map((menu, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i className={`${menu?.icon} text-success`}></i>
                      <span>{menu?.title}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedMenus.includes(menu?.id)}
                      onChange={() => handleCheckboxChange(menu?.id)}
                    />
                  </li>
                ))}
            </ul>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={async () => handleSave()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignMenusModal;
