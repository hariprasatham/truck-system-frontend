import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Pagination } from "react-bootstrap";
import "./TruckManagement.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AddTruckModal from "../components/AddTruckModal";
import EditTruckModal from "../components/EditTruckModal";
import DataTable from "react-data-table-component";
import ViewTruckDetails from "../components/ViewTruckDetails";
import useCompanyTruckStore from "../store/companyTruckStore";
import useUserStore from "../store/userStore";
import toast from "react-hot-toast";
import TableLoader from "../components/TableLoader";
import GlobalLoader from "../components/GlobalLoader";
import * as XLSX from "xlsx";
import TruckSample from "../assets/TruckSample.xlsx";

const TruckManagement = () => {
  const location = useLocation();
  const {
    fetchTrucksByCompany,
    pagination,
    loading,
    error,
    trucks,
    changeTruckStatus,
    addTruck,
    fetchTruckById,
    updateTruck,
    currentTruck,
    deleteTruck,
    bulkAddTrucks,
    fetchAllBrands,
  } = useCompanyTruckStore();

  const { user } = useUserStore();
  const [formData, setFormData] = useState({
    truck_no: "",
    vin_number: "",
    truck_brand: "",
    equipment_type: "",
    sub_type: "",
    truck_ownership: "",
    model: "",
    capacity: "",
    status: "active",
  });

  const [showChooseModal, setShowChooseModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [excelData, setExcelData] = useState([]);

  // console.log(excelData, "exceldata");

  // Derived state
  const role = user?.role;
  const params = useParams();

  const companyId = role === "admin" ? params.companyId : user?.companyId;
  const userId = role === "admin" ? params.userId : user?.userId;

  const openModal = () => setShowChooseModal(true);

  // Fetch drivers on component mount or when companyId/userId changes
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        await fetchTrucksByCompany(companyId);
      } catch (error) {
        toast.error(error.message || "Failed to load drivers");
      }
    };

    loadDrivers();
  }, [companyId, fetchTrucksByCompany]);

  const handleStatusChange = async (truckId, status) => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      await changeTruckStatus(truckId, newStatus);
      await fetchTrucksByCompany(companyId);
    } catch (error) {
      toast.error(error.message || "Failed to change truck status");
    }
  };

  const handleDelete = async (truckId) => {
    try {
      await deleteTruck(truckId);
      await fetchTrucksByCompany(companyId);
    } catch (error) {
      toast.error(error.message || "Failed to delete truck");
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Truck No",
      selector: (row) => row.truck_no,
      sortable: true,
    },
    {
      name: "Equipment Type",
      selector: (row) => row.equipment_type,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Capacity",
      selector: (row) => row.capacity,
      sortable: true,
      width: "100px",
    },
    {
      name: "Company",
      selector: (row) => row.company.company_name,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user.username,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`status_badge ${
            row.status == "active"
              ? "status-badge active"
              : "status-badge inactive"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {/* Activate / Deactivate */}
          <button
            className="btn-action"
            onClick={() => handleStatusChange(row.id, row.status)}
          >
            {row.status === "active" ? (
              <i className="bi bi-slash-circle"></i>
            ) : (
              <i className="bi bi-check-circle"></i>
            )}
          </button>

          <button
            className="btn-action"
            onClick={() => {
              setShowView(true);
              setViewData(row);
            }}
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn-action"
            onClick={() => {
              handlePencilClick(row.id);
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn-action"
            onClick={() => {
              handleDelete(row.id);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  const [showView, setShowView] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // Add Equipment
  const handleAdd = async (formData) => {
    try {
      await addTruck(formData, { companyId, userId });
      await fetchTrucksByCompany(companyId);
      setShowAdd(false);
      setFormData({
        truck_no: "",
        vin_number: "",
        truck_brand: "",
        equipment_type: "",
        sub_type: "",
        truck_ownership: "",
        model: "",
        capacity: "",
        status: "active",
      });
    } catch (error) {
      toast.error(error.message || "Failed to add truck");
    }
  };

  // Edit Equipment
  const handleEdit = async (updatedData) => {
    try {
      // Update the truck in the backend
      await updateTruck(editData.id, updatedData);
      // Refresh the trucks list
      await fetchTrucksByCompany(companyId);
      setShowEdit(false);
      setFormData({
        truck_no: "",
        vin_number: "",
        truck_brand: "",
        equipment_type: "",
        sub_type: "",
        truck_ownership: "",
        model: "",
        capacity: "",
        status: "active",
      });
    } catch (error) {
      toast.error(error.message || "Failed to update truck");
    }
  };

  const handlePencilClick = async (truckId) => {
    console.log("truckId", truckId);
    try {
      const truck = await fetchTruckById(truckId);
      setEditData(truck);
      setShowEdit(true);
    } catch (error) {
      toast.error("Failed to load truck details");
    }
  };

  const handleBulkSubmit = async () => {
    try {
      await bulkAddTrucks(excelData);

      // Close preview modal on success
      fetchTrucksByCompany(companyId);

      setShowPreviewModal(false);
    } catch (err) {
      console.error("Bulk upload failed:", err);
    }
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchTrucksByCompany(companyId, { limit: rowsPerPage });
  };

  const handlePageChange = (page) => {
    fetchTrucksByCompany(companyId, { page });
  };

  const requiredHeaders = [
    "Equipment Number",
    "Equipment Brand",
    "Equipment Type",
    "Equipment Sub Type",
    "Truck Ownership Type",
    "Truck Model",
    "Truck Year",
    "Truck Capacity",
    "VIN Number",
    "Status",
  ];

  const normalize = (str) =>
    str
      .toString()
      .trim()
      .replace(/\s+/g, " ") // collapse multiple spaces
      .toLowerCase();

  const readExcelFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Normalize all headers from Excel
      const fileHeaders = Object.keys(json[0] || {}).map(normalize);

      // Normalize required headers too
      const normalizedRequired = requiredHeaders.map(normalize);

      const missing = normalizedRequired.filter(
        (h) => !fileHeaders.includes(h)
      );

      if (missing.length > 0) {
        alert("Missing headers:\n" + missing.join("\n"));
        return;
      }

      setExcelData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (excelData.length === 0) {
      // alert("Please choose an Excel file first!");
      toast.error("Please choose an Excel file first!");
      return;
    }

    // Close first modal and open preview modal
    setShowChooseModal(false);
    setShowPreviewModal(true);
  };

  return (
    <div className="content">
      <GlobalLoader loading={loading} />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 ms-3">Equipment Management</h3>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn add-truck-btn-primary"
            onClick={() => setShowAdd(true)}
          >
            <i className="bi bi-plus-circle"></i> Add Equipment
          </button>
          <button className="btn btn btn-secondary ms-2" onClick={openModal}>
            <i className="bi bi-upload"></i> Import Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border">
        <div className="card-body p-0 rounded-3 overflow-hidden">
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={trucks}
              noHeader
              pagination={true}
              paginationServer={true}
              paginationTotalRows={pagination.total}
              paginationRowsPerPage={pagination.limit}
              paginationRowsPerPageOptions={[5, 10, 20]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              progressPending={loading}
              progressComponent={<TableLoader />}
            />
          </div>
        </div>
      </div>

      <ViewTruckDetails
        open={showView}
        onClose={() => setShowView(false)}
        truck={viewData}
      />

      {/* Add Equipment Modal */}
      <AddTruckModal
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        handleAdd={handleAdd}
        formData={formData}
        setFormData={setFormData}
        // fetchAllBrands={fetchAllBrands}
      />

      {/* Edit Equipment Modal */}
      {editData && (
        <EditTruckModal
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          handleEdit={handleEdit}
          editData={editData}
          formData={formData}
          setFormData={setFormData}
          // fetchAllBrands={fetchAllBrands}
        />
      )}

      {showChooseModal && (
        <div
          className="modal show fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose Excel File</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowChooseModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="form-control"
                  onChange={readExcelFile}
                />
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  // onClick={() => (window.location.href = TruckSample)}
                  onClick={() => window.open(TruckSample, "_blank")}
                  className="me-2"
                >
                  <i className="bi bi-download"></i> Download Template
                </Button>
                <button className="btn btn-success" onClick={handleUpload}>
                  Upload & Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- */}
      {/* MODAL #2 - PREVIEW DATA */}
      {/* ---------------------- */}
      {showPreviewModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Excel Preview</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPreviewModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div
                  className="table-responsive"
                  style={{
                    maxHeight: "60vh", // vertical scroll height
                    overflowY: "auto",
                    overflowX: "auto",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                  }}
                >
                  <table className="table table-bordered table-striped table-sm">
                    <thead>
                      <tr>
                        {requiredHeaders.map((h, idx) => (
                          <th key={idx}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.map((row, i) => (
                        <tr key={i}>
                          {requiredHeaders.map((h, j) => (
                            <td key={j}>{row[h]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-success"
                  disabled={loading}
                  onClick={handleBulkSubmit}
                >
                  {loading ? "Submitting..." : "Submit All Trucks"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TruckManagement;
