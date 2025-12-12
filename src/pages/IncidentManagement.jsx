import DataTable from "react-data-table-component";
import GlobalLoader from "../components/GlobalLoader";
import useIncidentManagementStore from "../store/incidentManagementStore";
import { useEffect, useCallback, useState } from "react";
import TableLoader from "../components/TableLoader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

const IncidentManagement = () => {
  const { incidents, loading, getAllIncidents, pagination, deleteIncident } =
    useIncidentManagementStore();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const handlePageChange = useCallback(
    (page) => {
      getAllIncidents({ page: page });
    },
    [getAllIncidents]
  );

  const handlePerRowsChange = useCallback(
    (newPerPage, page) => {
      getAllIncidents({ page, limit: newPerPage });
    },
    [getAllIncidents]
  );

  useEffect(() => {
    getAllIncidents();
  }, [getAllIncidents]);

  const handleViewIncidentReport = (id) => {
    navigate(`/incident-management/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteIncident(id);
    toast.success("Incident deleted successfully");
    setSelectedIncidentId(null);
    setShowConfirmDialog(false);
    getAllIncidents();
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      width: "8%",
    },
    {
      name: "Accident Date",
      selector: (row) => row?.accident_date,
      sortable: true,
    },
    {
      name: "Accident Time",
      selector: (row) => row?.accident_time,
      sortable: true,
    },
    {
      name: "Accident Description",
      selector: (row) => row?.accident_description,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`status-badge ${
            row.status === "active" ? "active" : "inactive"
          }`}
        >
          {row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1)}
        </span>
      ),
    },
    {
      name: "Truck No",
      selector: (row) => row?.truck?.truck_no,
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (row) => row?.driver?.first_name + " " + row?.driver?.last_name,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      sortable: true,
      cell: (row) => (
        <>
          <button
            className="btn-action"
            onClick={() => handleViewIncidentReport(row.id)}
          >
            <i className="bi bi-eye"></i>
          </button>

          {/* Delete (except admin) */}
          <button
            className="btn-action"
            onClick={() => {
              setSelectedIncidentId(row.id);
              setShowConfirmDialog(true);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  console.log("Pagination:", pagination);

  return (
    <div className="content">
      <GlobalLoader loading={false} />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 ms-3">Incident Management</h3>
        <div className="d-flex align-items-center gap-2"></div>
      </div>

      {/* Incidents Table */}
      <div className="card shadow-sm border">
        <div className="card-body p-0 rounded-3 overflow-hidden">
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={incidents || []}
              pagination
              paginationServer={true}
              paginationTotalRows={pagination.totalItems}
              paginationDefaultPage={pagination.currentPage}
              paginationRowsPerPage={pagination.itemsPerPage}
              paginationRowsPerPageOptions={[5, 10, 20]}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              progressPending={loading}
              progressComponent={<TableLoader />}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={() => handleDelete(selectedIncidentId)}
        title="Delete Incident"
        message="Are you sure you want to delete this incident?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default IncidentManagement;
