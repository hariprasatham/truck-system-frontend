import React, { useState, useMemo, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./FuelInvoiceManagement.css";
import FuelInvoiceModal from "../components/FuelInvoiceModal";
import { useNavigate } from "react-router-dom";
import useFuelStore from "../store/fuelStore";
import toast from "react-hot-toast";
import GlobalLoader from "../components/GlobalLoader";
import TableLoader from "../components/TableLoader";



const FuelInvoiceManagement = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});

  const { getAllFuelInvoices, fuelInvoices, trucks, fetchAllTrucksForFuelInvoice, downloadFuelInvoice, uploadFuelSheet, loading, spinnerMessage, pagination, timeoutId, cleanup } = useFuelStore();


  useEffect(() => {
    fetchAllTrucksForFuelInvoice();
    getAllFuelInvoices();

    return () => {
      cleanup();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedTruck?.trim()) {
      newErrors.selectedTruck = 'Please select a truck';
    }
    if (!file) {
      newErrors.file = 'Please upload a PDF invoice';
    } else if (file.type !== 'application/pdf') {
      newErrors.file = 'Only PDF files are allowed';
    }
    return newErrors;
  };

  const navigate = useNavigate();

  const [selectedTruck, setSelectedTruck] = useState("");
  const [truckType, setTruckType] = useState("");
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    const formdata = new FormData();
    formdata.append("truck_id", selectedTruck);
    formdata.append("fuelSheet", file);
    await uploadFuelSheet(formdata);
    setFile(null);
    setSelectedTruck("");
    setTruckType("");

    formRef.current.reset();
  };

  const handleDownloadClick = async (fuelId) => {
    const response = await downloadFuelInvoice(fuelId);
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "fuel-invoice.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };


  const handleViewClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  // DataTable Columns
  const columns = [
    {
      name: "Truck No",
      selector: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top" // Or 'bottom', 'left', 'right'
          title={row?.truck?.truck_no}
        >
          {row?.truck?.truck_no}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Truck Type",
      selector: (row) => (
        <span
          data-bs-toggle="tooltip"
          data-bs-placement="top" // Or 'bottom', 'left', 'right'
          title={row?.truck?.sub_type}
        >
          {row?.truck?.sub_type}
        </span>
      ),
      width: "150px",
    },
    // {
    //   name: "Card No",
    //   selector: (row) => <span>{row.card_no}</span>,
    //   width: "100px",
    // },
    {
      name: "Company",
      selector: (row) => <span>{row?.company?.company_name}</span>,
      width: "100px",
    },
    {
      name: "Start Date",
      selector: (row) => <span>{row?.start_date}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: "End Date",
      selector: (row) => <span>{row?.end_date}</span>,
      width: "120px",
    },
    {
      name: "Quantity",
      selector: (row) => <span>{row?.quantity}</span>,
      width: "120px",
    },
    {
      name: "Amount",
      selector: (row) => <span>{row?.amount}</span>,
      width: "100px",
    },
    {
      name: "PDF",
      cell: (row) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDownloadClick(row?.id)}
        >
          <i className="bi bi-file-earmark-pdf"></i>
        </button>
      ),
      width: "60px",
      // center: "true",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {/* <button className="btn btn-sm btn-primary me-2" onClick={() => handleViewClick(row)}>
            <i className="bi bi-eye"></i>
          </button> */}
          <button className="btn btn-sm btn-info text-white" onClick={() => navigate(`/view-fuel-data/${row?.id}`)}>
            <i className="bi bi-list"></i> View All Extracted
          </button>
        </>
      ),
    },
  ];

  // 🔍 Search + Date range filtering
  const filteredData = useMemo(() => {
    if (!fuelInvoices) {
      return [];
    }

    return fuelInvoices.filter((item) => {
      const matchSearch =
        item?.truck_no?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.truck_type?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.card_no?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.amount?.toString().includes(searchText.toLowerCase()) ||
        item?.quantity?.toString().includes(searchText.toLowerCase()) ||
        item?.company?.company_name?.toLowerCase().includes(searchText.toLowerCase());

      const startMatch = startDate
        ? moment(item.start_date).isSameOrAfter(startDate, "day")
        : true;
      const endMatch = endDate
        ? moment(item.start_date).isSameOrBefore(endDate, "day")
        : true;

      return matchSearch && startMatch && endMatch;
    });
  }, [searchText, startDate, endDate, fuelInvoices]);


  const handlePageChange = (page) => {
    getAllFuelInvoices({ page });
  };

  const handlePerRowsChange = (rowsPerPage) => {
    getAllFuelInvoices({ limit: rowsPerPage });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Clear error for this field when user selects a file
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleTruckChange = (e) => {
    const truckId = e.target.value;
    setSelectedTruck(truckId);
    const truck = trucks.find((t) => t.id === Number(truckId));
    setTruckType(truck ? truck.sub_type : "");
    // Clear error for this field when user makes a selection
    if (errors.selectedTruck) {
      setErrors((prev) => ({ ...prev, selectedTruck: '' }));
    }
  };

  return (
    <div className="content container mt-4">
      <h2 className="mb-3 ms-3">Fuel Invoice Upload</h2>

      {uploadMessage && <div className="alert alert-info">{uploadMessage}</div>}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} ref={formRef} className="row gy-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Truck No:</label>
          <select
            className={`form-control ${errors.selectedTruck ? 'is-invalid' : ''}`}
            value={selectedTruck}
            onChange={handleTruckChange}
          >
            <option value="">-- Select Truck --</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.truck_no}
              </option>
            ))}
          </select>
          {/* {errors.selectedTruck && (
            <div className="invalid-feedback d-block">
              {errors.selectedTruck}
            </div>
          )} */}
        </div>

        <div className="col-md-3">
          <label className="form-label">Truck Type:</label>
          <input
            type="text"
            className="form-control"
            value={truckType}
            readOnly
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">PDF Invoice:</label>
          <input
            type="file"
            className={`form-control ${errors.file ? 'is-invalid' : ''}`}
            accept="application/pdf"
            onChange={handleFileChange}
          />
          {/* {errors.file && (
            <div className="invalid-feedback d-block">
              {errors.file}
            </div>
          )} */}
        </div>

        <div className="col-md-3">
          <button type="submit" style={{ height: 40 }} className="btn btn-success">
            Upload
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="d-flex gap-3 align-items-center mt-3 mb-2">
        <div>
          <label className="form-label me-2">Filter by Search:</label>
          <input
            type="text"
            placeholder="🔍 Search..."
            className="form-control"
            style={{ width: "250px" }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label me-2">Filter by Date:</label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            className="form-control"
            placeholderText="Select Date Range"
          />
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0 rounded-3 overflow-hidden">


          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredData}
            highlightOnHover
            striped
            responsive
            pagination
            paginationServer={true}
            paginationTotalRows={pagination.total}
            paginationRowsPerPage={pagination.limit}
            paginationRowsPerPageOptions={[2, 10, 20]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        </div>
      </div>

      <FuelInvoiceModal show={showModal} onClose={() => setShowModal(false)} invoice={selectedInvoice} />
      <GlobalLoader loading={loading} message={spinnerMessage} />
    </div>
  );
};

export default FuelInvoiceManagement;
