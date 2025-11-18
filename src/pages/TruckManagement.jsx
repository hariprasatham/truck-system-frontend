import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Pagination } from "react-bootstrap";
import "./TruckManagement.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AddTruckModal from "../components/AddTruckModal";
import EditTruckModal from "../components/EditTruckModal";
import DataTable from "react-data-table-component";
import ViewTruckDetails from "../components/ViewTruckDetails";
import useCompanyTruckStore from "../store/companyTruckStore";
import useUserStore  from "../store/userStore";
import toast from "react-hot-toast";
import TableLoader from "../components/TableLoader";
import GlobalLoader from "../components/GlobalLoader";

const TruckManagement = () => {

  const navigate = useNavigate();
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
    deleteTruck 
  } = useCompanyTruckStore();
  const { user } = useUserStore();
  
   // Derived state
  const role = user?.role;
  const params = useParams();

  const companyId = role === "admin" ? params.companyId : user?.companyId;
  const userId = role === "admin" ? params.userId : user?.userId;

// Fetch drivers on component mount or when companyId/userId changes
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        await fetchTrucksByCompany(companyId);
      } catch (error) {
        toast.error(error.message || 'Failed to load drivers');
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
      toast.error(error.message || 'Failed to change truck status');
    }
  };

  const handleDelete = async (truckId) => {
    try {
      await deleteTruck(truckId);
      await fetchTrucksByCompany(companyId);
    } catch (error) {
      toast.error(error.message || 'Failed to delete truck');
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
            onClick={()=>{
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
    } catch (error) {
      toast.error(error.message || 'Failed to add truck');
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
    } catch (error) {
      toast.error(error.message || 'Failed to update truck');
    }
  };

  const handlePencilClick = async (truckId) => {

    console.log("truckId", truckId);
    try {
      const truck = await fetchTruckById(truckId);
      setEditData(truck);
      setShowEdit(true);
    } catch (error) {
      toast.error('Failed to load truck details');
    }
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchTrucksByCompany(companyId, { limit: rowsPerPage });
  };

  const handlePageChange = (page) => {
    fetchTrucksByCompany(companyId, { page });
  };

  return (
    <div className="content">
      <GlobalLoader loading={loading} />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 ms-3">Equipment Management</h3>
        <div className="d-flex align-items-center gap-2">
          <button className="btn add-truck-btn-primary" onClick={() => setShowAdd(true)}>
            <i className="bi bi-plus-circle"></i> Add Equipment
          </button>
          <button className="btn btn-primary">
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
      />

      {/* Edit Equipment Modal */}
{editData && (
        <EditTruckModal 
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          handleEdit={handleEdit}
          editData={editData}
        />
      )}
    </div>
  );
};

export default TruckManagement;
