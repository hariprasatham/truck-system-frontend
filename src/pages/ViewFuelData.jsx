import React, { useState, useMemo } from 'react'
import DataTable from "react-data-table-component";

  const groupedData = [
    { driver: "John Doe", quantity: 50.5, location_name: "Station A", count: 3 },
    { driver: "Jane Smith", quantity: 30.0, location_name: "Station B", count: 2 },
    { driver: "Mike Johnson", quantity: 20.75, location_name: "Station A", count: 1 },
    { driver: "Emily Davis", quantity: 40.0, location_name: "Station C", count: 4 },
    { driver: "David Wilson", quantity: 25.5, location_name: "Station B", count: 2 },
    { driver: "Sarah Brown", quantity: 35.0, location_name: "Station C", count: 3 },
    { driver: "Chris Lee", quantity: 45.25, location_name: "Station A", count: 5 },
    { driver: "Anna Garcia", quantity: 15.0, location_name: "Station B", count: 1 },
    { driver: "James Martinez", quantity: 55.0, location_name: "Station C", count: 4 },
    { driver: "Laura Rodriguez", quantity: 28.5, location_name: "Station A", count: 2 },
    { driver: "Daniel Hernandez", quantity: 32.0, location_name: "Station B", count: 3 },
    { driver: "Olivia Lopez", quantity: 22.75, location_name: "Station C", count: 2 },
    // Add more sample data as needed
  ];

  const locationNames = [...new Set(groupedData.map((item) => item.location_name))];


const ViewFuelData = () => {
     const [selectedLocation, setSelectedLocation] = useState("");
     // --- Filter data by selected location ---
  const filteredData = useMemo(() => {
    if (!selectedLocation) return groupedData;
    return groupedData.filter((row) => row.location_name === selectedLocation);
  }, [selectedLocation, groupedData]);


  // --- Define columns for react-data-table-component ---
  const columns = [
    {
      name: "Driver",
      selector: (row) => row.driver,
      sortable: true,
    },
    {
      name: "Petrol Quantity",
      selector: (row) => (row.quantity * 3).toFixed(2),
      sortable: true,
      right: true,
    },
    {
      name: "Location Name",
      selector: (row) => row.location_name,
      sortable: true,
    },
    {
      name: "Total Quantity",
      selector: (row) => row.quantity.toFixed(1),
      sortable: true,
      right: true,
    },
    {
      name: "Count",
      selector: (row) => row.count,
      sortable: true,
      right: true,
    },
  ];

  // --- Custom Styles for Table ---
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        fontSize: "13px",
      },
    },
    cells: {
      style: {
        fontSize: "12px",
      },
    },
  };

  return (
     <div className="container content mt-4">
      <h2 className="mb-4 text-success ms-3">Fuel Data by Driver and Location</h2>

      {/* --- Filter Section --- */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-3 col-sm-6">
          <label htmlFor="locationFilter" className="form-label fw-bold">
            Filter by Location:
          </label>
          <select
            id="locationFilter"
            className="form-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locationNames.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 col-sm-6 mt-2 mt-sm-0">
          <button
            className="btn btn-outline-secondary mt-4"
            onClick={() => setSelectedLocation("")}
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* --- React Data Table --- */}
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        striped
        highlightOnHover
        responsive
        dense
        noDataComponent={
          <div className="text-muted py-3">No data available</div>
        }
      />
    </div>
  )
}

export default ViewFuelData