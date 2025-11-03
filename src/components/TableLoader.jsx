import React from "react";
import "./TableLoader.css";

const TableLoader = () => {
  return (
    <div className="table-loader-container">
      <div className="spinner"></div>
      <div className="loader-text">Loading...</div>
    </div>
  );
};

export default TableLoader;