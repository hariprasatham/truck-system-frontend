import React from "react";
import "./TableLoader.css";

const TableLoader = ({message = "Loading..."}) => {
  return (
    <div className="table-loader-container">
      <div className="spinner"></div>
      <div className="loader-text">{message}</div>
    </div>
  );
};

export default TableLoader;