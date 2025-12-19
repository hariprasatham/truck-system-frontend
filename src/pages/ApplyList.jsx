import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import useMasterStore from "../store/masterStore";

const ExpandableComponent = ({ data }) => {
  const [tab, setTab] = useState("active");
  const listToShow = tab === "active" ? data.list : data.history;
  const { downloadAuthorityPdf } = useMasterStore();
  return (
    <div style={{ padding: "10px" }}>
      {/* Tabs for Active / History */}
      <div className="mb-2">
        {/* <button
          className={`btn btn-sm me-2 ${
            tab === "active" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setTab("active")}
        >
          Active Applications
        </button> */}
        {/* <button
          className={`btn btn-sm ${
            tab === "history" ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={() => setTab("history")}
        >
          History Applications
        </button> */}
      </div>

      {listToShow.length === 0 ? (
        <p className="text-muted">No {tab} applications available.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Authority</th>
              {/* <th>Country</th> */}
              {/* <th>Applied Count</th> */}
              <th style={{ width: "120px" }}>Document</th>

              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {listToShow.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.Authority.authority_name}</td>
                {/* <td>
                  {item.is_us && "US "}
                  {item.is_canada && "Canada"}
                </td> */}
                <td>
                  {item?.document_path ? (
                    <a
                      onClick={() =>
                        downloadAuthorityPdf(
                          item.id,
                          item.Authority?.authority_name
                        )
                      }
                      target="_blank" // open in new tab
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-success"
                      title="View/Download PDF"
                    >
                      <i className="bi bi-file-pdf" />
                    </a>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                {/* <td>{item.applies_count}</td> */}
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ApplyList = () => {
  const { fetchAuthorityList, loading } = useMasterStore();
  const [applications, setApplications] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null); // Only one row expanded

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAuthorityList();
      setApplications(data);
    };
    loadData();
  }, []);

  const columns = [
    {
      name: "Requested By",
      selector: (row) => row.applied_by.username,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row) => row.company.company_name,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) =>
        row.company.is_us && row.company.is_canada
          ? "US & Canada"
          : row.company.is_us
          ? "US"
          : row.company.is_canada
          ? "Canada"
          : "-",
      sortable: true,
    },
    // {
    //   name: "Active Applications",
    //   selector: (row) => row.list.length,
    //   sortable: true,
    // },
    // {
    //   name: "History Applications",
    //   selector: (row) => row.history.length,
    //   sortable: true,
    // },
  ];

  return (
    <div className="container content mt-4">
      <h2 className="mb-4 text-success">Authority Apply List</h2>

      {loading && <p>Loading...</p>}

      {!loading && applications.length === 0 && (
        <p className="text-muted">No applications found.</p>
      )}

      {!loading && applications.length > 0 && (
        <div style={{ border: "1px solid #d3cccc", borderRadius: "7px" }}>
          <DataTable
            columns={columns}
            data={applications}
            expandableRows
            expandOnRowClicked
            expandableRowsComponent={ExpandableComponent}
            expandableRowExpanded={(row) => {
              // row.id === expandedRowId
              console.log(row);
            }}
            onRowExpandToggled={(row) =>
              setExpandedRowId((prev) => (prev === row.id ? null : row.id))
            }
            highlightOnHover
            striped
            responsive
            noDataComponent={
              <div className="p-3 text-muted">No data found.</div>
            }
            customStyles={{
              //   rows: { style: { border: "1px solid #dee2e6" } },
              headCells: {
                style: {
                  borderBottom: "1px solid #dee2e6",
                  fontWeight: "bold",
                },
              },
              cells: { style: { borderBottom: "1px solid #dee2e6" } },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ApplyList;
