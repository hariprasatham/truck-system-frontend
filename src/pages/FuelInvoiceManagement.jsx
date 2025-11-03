import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./FuelInvoiceManagement.css";
import FuelInvoiceModal from "../components/FuelInvoiceModal";
import { useNavigate } from "react-router-dom";

const FuelInvoiceManagement = () => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const trucks = [
    { id: 1, truck_no: "TN09AB1234", truck_type: "Tata 1613" },
    { id: 2, truck_no: "TN10CD5678", truck_type: "Ashok Leyland 2518" },
    { id: 3, truck_no: "TN11EF9999", truck_type: "BharatBenz 1623" },
  ];

  const invoices = [
    {
      id: 1,
      truck_no: "TN09AB1234",
      truck_type: "Tata 1613",
      card_no: "CARD001",
      company_name: "Indian Oil",
      start_date: "2025-10-01",
      end_date: "2025-10-05",
      product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 120,
      final_amount: 9500.02,
      file_path: "/dummy/fuel_invoice1.pdf",
    },
    {
      id: 2,
      truck_no: "TN10CD5678",
      truck_type: "Ashok Leyland 2518",
      card_no: "CARD002",
      company_name: "HPCL",
      start_date: "2025-09-15",
      end_date: "2025-09-20",
            product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 150,
      final_amount: 11200,
      file_path: "/dummy/fuel_invoice2.pdf",
    },
    {
      id: 3,
      truck_no: "TN09AB1234",
      truck_type: "Tata 1613",
      card_no: "CARD001",
      company_name: "Indian Oil",
      start_date: "2025-10-01",
      end_date: "2025-10-05",
            product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 120,
      final_amount: 9500,
      file_path: "/dummy/fuel_invoice1.pdf",
    },
    {
      id: 4,
      truck_no: "TN10CD5678",
      truck_type: "Ashok Leyland 2518",
      card_no: "CARD002",
      company_name: "HPCL",
      start_date: "2025-09-15",
      end_date: "2025-09-20",
            product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 150,
      final_amount: 11200,
      file_path: "/dummy/fuel_invoice2.pdf",
    },
    {
      id: 5,
      truck_no: "TN09AB1234",
      truck_type: "Tata 1613",
      card_no: "CARD001",
      company_name: "Indian Oil",
      start_date: "2025-10-01",
      end_date: "2025-10-05",
            product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 120,
      final_amount: 9500,
      file_path: "/dummy/fuel_invoice1.pdf",
    },
    {
      id: 6,
      truck_no: "TN10CD5678",
      truck_type: "Ashok Leyland 2518",
      card_no: "CARD002",
      company_name: "HPCL",
      start_date: "2025-09-15",
      end_date: "2025-09-20",
            product_code: "P001",
      pretax_amt: 9000,
      gst: 500,
      hst: 0,
      pft: 0,
      pst: 0,
      fet: 0,
      qst: 0,
      quantity: 150,
      final_amount: 11200,
      file_path: "/dummy/fuel_invoice2.pdf",
    },
  ];

  const [selectedTruck, setSelectedTruck] = useState("");
  const [truckType, setTruckType] = useState("");
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleTruckChange = (e) => {
    const truckId = e.target.value;
    setSelectedTruck(truckId);
    const truck = trucks.find((t) => t.id === Number(truckId));
    setTruckType(truck ? truck.truck_type : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTruck || !file) {
      setUploadMessage("⚠️ Please select truck and upload PDF.");
      setTimeout(() => setUploadMessage(""), 3000);
      return;
    }
    setUploadMessage("✅ Fuel invoice uploaded successfully!");
    setTimeout(() => setUploadMessage(""), 3000);
    setFile(null);
    setSelectedTruck("");
    setTruckType("");
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
          title={row.truck_type}
        >
          {row.truck_no}
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
          title={row.truck_type}
        >
          {row.truck_type}
        </span>
      ),
      width: "150px",
    },
    {
      name: "Card No",
      selector: (row) => <span>{row.card_no}</span>,
      width: "100px",
    },
    {
      name: "Company",
      selector: (row) => <span>{row.company_name}</span>,
      width: "100px",
    },
    {
      name: "Start Date",
      selector: (row) => <span>{row.start_date}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: "End Date",
      selector: (row) => <span>{row.end_date}</span>,
      width: "120px",
    },
    {
      name: "Quantity",
      selector: (row) => <span>{row.quantity}</span>,
      width: "80px",
    },
    {
      name: "Amount",
      selector: (row) => <span>{row.final_amount}</span>,
      width: "80px",
    },
    {
      name: "PDF",
      cell: (row) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => window.open(row.file_path, "_blank")}
        >
          <i className="bi bi-file-earmark-pdf"></i>
        </button>
      ),
      width: "60px",
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleViewClick(row)}>
            <i className="bi bi-eye"></i>
          </button>
          <button className="btn btn-sm btn-info text-white" onClick={()=>navigate(`/view-fuel-data/${row.id}`)}>
            <i className="bi bi-list"></i> View All Extracted
          </button>
        </>
      ),
    },
  ];

  // 🔍 Search + Date range filtering
  const filteredData = useMemo(() => {
    return invoices.filter((item) => {
      const matchSearch =
        item.truck_no.toLowerCase().includes(searchText.toLowerCase()) ||
        item.truck_type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.card_no.toLowerCase().includes(searchText.toLowerCase()) ||
        item.final_amount.toString().includes(searchText.toLowerCase()) ||
        item.quantity.toString().includes(searchText.toLowerCase()) ||
        item.company_name.toLowerCase().includes(searchText.toLowerCase());

      const startMatch = startDate
        ? moment(item.start_date).isSameOrAfter(startDate, "day")
        : true;
      const endMatch = endDate
        ? moment(item.start_date).isSameOrBefore(endDate, "day")
        : true;

      return matchSearch && startMatch && endMatch;
    });
  }, [searchText, startDate, endDate, invoices]);

  return (
    <div className="content container mt-4">
      <h2 className="mb-3 ms-3">Fuel Invoice Upload</h2>

      {uploadMessage && <div className="alert alert-info">{uploadMessage}</div>}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="row gy-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Truck No:</label>
          <select
            className="form-control"
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
            className="form-control"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="col-md-3">
          <button type="submit" style={{height: 40}} className="btn btn-success">
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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        persistTableHead
        defaultSortFieldId={5}
        paginationRowsPerPageOptions={[5, 10, 25, 50]}
      />

      <FuelInvoiceModal show={showModal} onClose={() => setShowModal(false)} invoice={selectedInvoice} /> 
    </div>
  );
};

export default FuelInvoiceManagement;
