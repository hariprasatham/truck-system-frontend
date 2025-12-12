import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import useFuelStore from "../store/fuelStore";
import { useParams } from "react-router-dom";

const ViewFuelData = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const { currentFuelInvoice, getFuelInvoiceById } = useFuelStore();
  const { fuelId } = useParams();
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    getFuelInvoiceById(fuelId);
  }, [fuelId]);

  const locationNames = [
    ...new Set(currentFuelInvoice?.map((item) => item.province)),
  ];

  // Toggle row expanded state
  const handleRowExpandToggled = (toggled) => {
    setExpandedRows((prev) => ({
      ...prev,
      [toggled.province]: !prev[toggled.province],
    }));
  };

  // --- Define columns for react-data-table-component ---
  const columns = [
    // {
    //   name: "Driver",
    //   selector: (row) => row.driver,
    //   sortable: true,
    // },
    {
      name: "State",
      selector: (row) => row.state_name + " - " + row.province,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country_name,
      sortable: true,
    },
    {
      name: "Diesel Quantity",
      selector: (row) => row.total_qty.toFixed(3),
      sortable: true,
      right: true,
    },

    // {
    //   name: "Total Quantity",
    //   selector: (row) => parseFloat(row.total_final_amount).toFixed(3),
    //   sortable: true,
    //   right: true,
    // },
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
        // backgroundColor: "#f8f9fa",
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

  // Child columns
  const childColumns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Diesel Quantity",
      selector: (row) => parseFloat(row.qty).toFixed(2),
      sortable: true,
      right: true,
    },
    // {
    //   name: "Amount",
    //   selector: (row) => parseFloat(row.final_amount).toFixed(2),
    //   sortable: true,
    //   right: true,
    // },
    // {
    //   name: "Unit Price",
    //   selector: (row) => (row.final_amount / row.qty).toFixed(2),
    //   sortable: true,
    //   right: true,
    // },
  ];

  // Custom expandable component
  const ExpandableComponent = ({ data }) => (
    <div className="p-3 bg-light">
      <h6 className="mb-3">
        Fuel Entries for {data.state_name} - {data.province}
      </h6>
      <DataTable
        columns={childColumns}
        data={data.records}
        customStyles={{
          headCells: {
            style: {
              backgroundColor: "#e9ecef",
              fontSize: "12px",
            },
          },
          cells: {
            style: {
              fontSize: "12px",
            },
          },
        }}
        dense
        noHeader
      />
    </div>
  );

  // Filter data based on selected location
  const filteredData = useMemo(() => {
    if (!selectedLocation || !currentFuelInvoice)
      return currentFuelInvoice || [];
    return currentFuelInvoice.filter(
      (item) => item.province === selectedLocation
    );
  }, [currentFuelInvoice, selectedLocation]);

  return (
    <div className="container content mt-4">
      <h2 className="mb-4 text-success ms-3">Fuel Data by Location</h2>

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
            {locationNames?.map((loc, index) => (
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
      {/* <DataTable
        columns={columns}
        data={currentFuelInvoice}
        customStyles={customStyles}
        pagination
        striped
        highlightOnHover
        responsive
        dense
        noDataComponent={
          <div className="text-muted py-3">No data available</div>
        }
      /> */}

      {/* Main Data Table */}
      <div className="card">
        <div className="card-body p-0 rounded-3 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredData}
            expandableRows
            expandableRowsComponent={ExpandableComponent}
            expandOnRowClicked={true}
            expandableRowExpanded={(row) => expandedRows[row.province] || false}
            onRowExpandToggled={handleRowExpandToggled}
            expandableRowDisabled={(row) =>
              !row.records || row.records.length === 0
            }
            expandableRowsHideExpander={false}
            // pagination
            // striped
            highlightOnHover
            customStyles={customStyles}
            responsive
            noDataComponent={
              <div className="text-muted p-3">No fuel data available</div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewFuelData;
