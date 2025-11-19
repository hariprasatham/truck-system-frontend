import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import "./MenuManagement.css";
import AddMenuModal from "../components/AddMenuModal";
import EditMenuModal from "../components/EditMenuModal";
import DataTable from "react-data-table-component";
import useMenuStore from "../store/menuStore";
import TableLoader from "../components/TableLoader";
import AddBrandModal from "../components/AddBrandModal";
import useCompanyTruckStore from "../store/companyTruckStore";

const Brand = () => {
  const { allMenus, getMenuById, updateMenu, createMenu, loading, pagination, fetchAllMenus, deleteMenu } = useMenuStore();
    const { addBrand, fetchAllBrands  } = useCompanyTruckStore()

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const [topLevelMenus, setTopLevelMenus] = useState(
    allMenus.filter((menu) => menu.parentId == null)
  );

  const handleDelete = async (id) => {
    try {
      await deleteMenu(id);
    } catch (error) {
      console.log(error);
    }
  };


  const handlePencilClick = async (name) => {
    try {
      setEditData({name});
      setShowAdd(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setTopLevelMenus(allMenus.filter((menu) => menu.parentId == null));
  }, [allMenus]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data)
    try {
      await updateMenu(editData.id, {
        title: data.title,
        url: data.url,
        icon: data.icon,
        sort_order: data.sort_order,
        parentId: data.parent_id,
      });
      setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.actions,
      sortable: true,
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn-action"
            onClick={() => {
              handlePencilClick(row.name)
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn-action"
            onClick={() => handleDelete(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
    },
  ]

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        if(editData && editData?.id) {
            
        } else {
            const newBrand = {
            brand_name: e.target.name.value,
            };
            await addBrand(newBrand)
        }
        
    } catch (error) {
      console.log(error)
    }

    setShowAdd(false);
  };

  const handlePageChange = (page) => {
    fetchAllMenus({ page });
  };

  const handlePerRowsChange = (rowsPerPage) => {
    fetchAllMenus({ limit: rowsPerPage });
  };


  return (
    <div className="content">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Menu Management</h3>


        <Button variant="primary" onClick={() => setShowAdd(true)}>
          <i className="bi bi-plus-circle"></i> Add Menu
        </Button>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-body p-0 rounded-3 overflow-hidden">

          <DataTable
            columns={columns}
            data={allMenus}
            pagination
            paginationServer={true}
            paginationTotalRows={pagination.totalItems}
            paginationRowsPerPage={pagination.limit}
            paginationRowsPerPageOptions={[5, 10, 20]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            progressPending={loading}
            progressComponent={<TableLoader />}
          />
        </div>
      </div>

      {/* Add Menu Modal */}
      <AddBrandModal showAdd={showAdd} setShowAdd={setShowAdd} handleAdd={handleAdd} editData={editData}/>

      {/* Edit Menu Modal */}
      {/* {editData && (
        <EditMenuModal showEdit={showEdit} setShowEdit={setShowEdit} handleEdit={handleEditSubmit} editData={editData} topLevelMenus={topLevelMenus} />
      )} */}
    </div>
  );
};

export default Brand;
