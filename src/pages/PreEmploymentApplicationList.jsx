import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "./MenuManagement.css";
import AddMenuModal from "../components/AddMenuModal";
import EditMenuModal from "../components/EditMenuModal";
import DataTable from "react-data-table-component";
import TableLoader from "../components/TableLoader";
import "./PreEmploymentCheck.css"
import { useNavigate } from "react-router-dom";
import usePreEmploymentApplicationStore from "../store/preEmploymentApplicationStore";
import ConfirmDialog from "../components/ConfirmDialog";

const PreEmploymentApplicationList = () => {

  const { allApplications, loading, pagination, fetchAllApplications, deleteApplication, downloadApplication } = usePreEmploymentApplicationStore();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchAllApplications();
  }, []);


  const navigate = useNavigate();


const handleDownloadApplication = async (filePath) => {
  try {
      const response = await downloadApplication(filePath);
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "application.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Error downloading application:", error);
    toast.error(
      error.response?.data?.message || "❌ Failed to download application"
    );
  }

}

const handleDeleteApplication = (id) => {
  setShowConfirmDialog(true);
  setDeleteId(id);
}

const handleConfirmDelete = () => {
  setShowConfirmDialog(false);
  deleteApplication(deleteId);
}

const handleCancelDelete = () => {
  setShowConfirmDialog(false);
  setDeleteId(null);
}

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.full_name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.application_date ? new Date(row.application_date).toLocaleDateString() : "",
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.position_applied,
      sortable: true,
    },
    {
      name: "PDF",
      selector: (row) => row.pdf_file,
      sortable: true,
      cell: (row) => (
                 <button
            className="btn-action"
            onClick={() => {
              handleDownloadApplication(row.pdf_file)
            }}
          >
            <i className="bi bi-file-pdf"></i>
          </button>
      ),
    },{
      name: "Actions",
      selector: (row) => row.id,
      sortable: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn-action"
            onClick={() => {
              navigate("/pre-employment-application/form", { state: { applicationId: row.id } });
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn-action"
            onClick={() => {
              handleDeleteApplication(row.id);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
    }
  ]


  const handlePageChange = (page) => {
    fetchAllApplications({ page });
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchAllApplications({ limit: rowsPerPage });
  };


  return (
    <div className="content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Saved Applications</h3>


        <button className="add-application-btn-primary" onClick={() => navigate("/pre-employment-application/form")}>
          <i className="bi bi-plus-circle"></i> Add Application
        </button>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="table-responsive">

          <DataTable
            columns={columns}
            data={allApplications}
            pagination
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
      <ConfirmDialog
        show={showConfirmDialog}
        title="Confirm Action"
        message="Are you sure you want to delete this application?"
        onConfirm={handleConfirmDelete}
        onHide={handleCancelDelete}
      />
    </div>
  );
};

export default PreEmploymentApplicationList;
