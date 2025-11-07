import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Tooltip } from "bootstrap";
import "./Sidebar.css";

import useMenuStore from "../store/menuStore";

const Sidebar = ({ collapsed, setCollapsed }) => {

  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();

  const { userMenus } = useMenuStore();


  // Initialize Bootstrap tooltips
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new Tooltip(el));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const toggleSubMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // const menuItems = [
  //   { name: "Dashboard", icon: "bi-speedometer2", path: "/dashboard" },
  //   { name: "Companies", icon: "bi-building", path: "/companies" },
  //   { name: "Menu Management", icon: "bi-link-45deg", path: "/menu-management" },
  //   { name: "Truck Management", icon: "bi-truck", path: "/truck-management" },
  //   { name: "Fuel Invoice", icon: "bi-file-earmark-bar-graph me-2", path: "/fuel-invoice-management" },
  //   { name: "Pre-Employment Check", icon: "bi-file-earmark-bar-graph me-2", path: "/pre-employment-check" },
  //   { name: "Drivers", icon: "bi-file-earmark-person me-2", path: "/drivers" },
  //   {
  //     name: "Reports",
  //     icon: "bi-bar-chart",
  //     submenu: [
  //       { name: "Monthly", icon: "bi-calendar", path: "/reports/monthly" },
  //       { name: "Yearly", icon: "bi-calendar2-check", path: "/reports/yearly" },
  //     ],
  //   },
  //   {
  //     name: "Settings",
  //     icon: "bi-gear",
  //     submenu: [
  //       { name: "Profile", icon: "bi-person", path: "/settings/profile" },
  //       { name: "Security", icon: "bi-shield-lock", path: "/settings/security" },
  //     ],
  //   },
  // ];
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Sidebar */}
      <div id="sidebar" className={`sidebar d-flex flex-column p-3 ${collapsed ? "collapsed" : ""}`}>
        {!collapsed && <h4 className="fw-bold mb-4 text-success">Dasher</h4>}

        <ul className="nav flex-column mb-auto">
          {userMenus.map((item) => (
            <li key={item?.title} className="mb-2">
              {item?.submenu ? (
                <>
                  {/* Parent with submenu */}
                  <button
                    className={`nav-link w-100 d-flex justify-content-between align-items-center ${
                      openMenus[item?.title] ? "active" : ""
                    }`}
                    onClick={() => toggleSubMenu(item.title)}
                    data-bs-toggle={collapsed ? "tooltip" : ""}
                    data-bs-placement="right"
                    title={collapsed ? item.title : ""}
                  >
                    <span className="d-flex align-items-center">
                      <i className={`${item.icon} me-2`}></i>
                      {!collapsed && <span>{item.name}</span>}
                    </span>
                    {!collapsed && (
                      <i
                        className={`bi ${
                          openMenus[item?.name] ? "bi-chevron-down" : "bi-chevron-right"
                        } small`}
                      ></i>
                    )}
                  </button>

                  {/* Submenu */}
                  {openMenus[item?.title] && (
                    <div className="ps-3 mt-1">
                      {item?.submenu.map((sub) => (
                        <Link
                          key={sub?.title}
                          to={sub?.url}
                          className={`d-block py-1 px-2 nav-link ${
                            location.pathname === sub.url ? "active" : ""
                          }`}
                          data-bs-toggle={collapsed ? "tooltip" : ""}
                          data-bs-placement="right"
                          title={collapsed ? sub.title : ""}
                        >
                          <i className={`${sub.icon} me-2`}></i>
                          {!collapsed && <span>{sub.title}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Normal link
                <Link
                  to={item?.url}
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === item?.url ? "active" : ""
                  }`}
                  data-bs-toggle={collapsed ? "tooltip" : ""}
                  data-bs-placement="right"
                  title={collapsed ? item?.title : ""}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {!collapsed && <span>{item?.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <hr className="my-3" />

        <div className="mt-auto text-center">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
            data-bs-toggle={collapsed ? "tooltip" : ""}
            data-bs-placement="right"
            title={collapsed ? "Logout" : ""}
          >
            <i className="bi bi-box-arrow-right"></i>
            {!collapsed && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <button
        id="sidebarToggle"
        className="btn btn-light position-fixed"
        style={{ top: "10px", left: collapsed ? "70px" : "260px", zIndex: 1050 }}
        onClick={toggleSidebar}
      >
        <i className={`bi ${collapsed ? "bi-arrow-right-circle" : "bi-arrow-left-circle"}`}></i>
      </button>
    </>
  );
};

export default Sidebar;
