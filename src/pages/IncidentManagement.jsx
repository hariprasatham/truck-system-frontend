import DataTable from "react-data-table-component";
import GlobalLoader from "../components/GlobalLoader"
import useIncidentManagementStore from "../store/incidentManagementStore"
import { useEffect } from "react"
import TableLoader from "../components/TableLoader";
import { useNavigate } from "react-router-dom";

const IncidentManagement = () => {
  const { incidents, loading, getAllIncidents, pagination } = useIncidentManagementStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllIncidents();
  }, []);

  if (loading && !incidents?.length) {
    return <GlobalLoader />;
  }

  const handleViewIncidentReport = (id) => {
    navigate(`/incident-management/${id}`);
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      width: "8%"

    },
    {
      name: "accident_date",
      selector: (row) => row?.accident_date,
      sortable: true,
   
    },
    {
      name: "accident_time",
      selector: (row) => row?.accident_time,
      sortable: true,
    },
    {
      name: "accident_description",
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
      name: "truck_no",
      selector: (row) => row?.truck?.truck_no,
      sortable: true,
    },
    {
      name: "supervisor_name",
      selector: (row) => row?.supervisor_name,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      sortable: true,
      cell: (row) => (
        <>
          {/* edit */}
          <button
            className="btn-action"
            // onClick={() => handleEditDriver(row.id)}
          >
            <i className="bi bi-pencil"></i>
          </button>

          <button
            className="btn-action"
            onClick={() => handleViewIncidentReport(row.id)}
          >
            <i className="bi bi-eye"></i>
          </button>

          {/* Delete (except admin) */}
          <button className="btn-action" 
        //   onClick={() => handleDelete(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </>
      ),
    },
  ];

  const handlePageChange = ({page}) => {
    getAllIncidents({ page });
  };

  const handlePerRowsChange = (rowsPerPage) => {
    getAllIncidents({ page: 1, limit: rowsPerPage });
  };

  return (
        <div className="content">
      <GlobalLoader loading={false} />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 ms-3">Incident Management</h3>
        <div className="d-flex align-items-center gap-2">
        </div>
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
      

    </div>
  )
}

export default IncidentManagement