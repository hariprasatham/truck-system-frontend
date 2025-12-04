import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Badge, Form, Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import useFleetStore from "../store/fleetStore";

const FleetManagement = () => {
  const {
    fleets,
    fetchFleets,
    fetchAllTrucksByCompanies,
    linkTrucks,
    updateFleet,
    getFleetTrucksData,
    addFleet, // <-- addFleet from Zustand
  } = useFleetStore();

  const [fleetTrucksData, setFleetTrucksData] = useState(null);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedTrucks, setSelectedTrucks] = useState([]);
  const [showLinkTruckModal, setShowLinkTruckModal] = useState(false);
  const [showEditFleetModal, setShowEditFleetModal] = useState(false);
  const [editFleetForm, setEditFleetForm] = useState({
    id: null,
    name: "",
    status: 1,
  });
  const [expandedRows, setExpandedRows] = useState({});
  const [showAddFleetModal, setShowAddFleetModal] = useState(false);
  const [newFleetName, setNewFleetName] = useState("");

  useEffect(() => {
    fetchFleets();
    fetchAllTrucksByCompanies();
  }, []);

  // --- Add Fleet ---
  const handleAddFleet = async () => {
    if (!newFleetName.trim()) {
      toast.error("Fleet name is required");
      return;
    }
    try {
      await addFleet({ name: newFleetName, status: 1 });
      // toast.success("Fleet added successfully!");
      setNewFleetName("");
      setShowAddFleetModal(false);
      fetchFleets(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add fleet");
    }
  };

  // --- Open Link Trucks Modal ---
  const openLinkTruckModal = async (fleet) => {
    setSelectedFleet(fleet);
    try {
      const data = await getFleetTrucksData(fleet.id);
      setFleetTrucksData(data);
      setSelectedTrucks(data.linkedTrucks.map((t) => t.id));
      setShowLinkTruckModal(true);
    } catch {
      // toast.error("Failed to load trucks");
    }
  };

  // --- Update Fleet ---
  const handleUpdateFleet = async () => {
    try {
      await updateFleet(editFleetForm.id, {
        name: editFleetForm.name,
        status: editFleetForm.status,
      });
      // toast.success("Fleet updated!");
      setShowEditFleetModal(false);
      fetchFleets();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // --- Handle Truck Checkbox ---
  const handleTruckCheckbox = (truckId) => {
    if (selectedTrucks.includes(truckId)) {
      setSelectedTrucks(selectedTrucks.filter((id) => id !== truckId));
    } else {
      setSelectedTrucks([...selectedTrucks, truckId]);
    }
  };

  // --- Link Trucks ---
  const handleLinkTrucks = async () => {
    if (!selectedFleet) return;
    try {
      await linkTrucks(selectedFleet.id, selectedTrucks);
      // toast.success("Trucks linked successfully!");
      setShowLinkTruckModal(false);
      fetchFleets();
    } catch {}
  };

  // --- Fleet Table Columns ---
  const columns = [
    { name: "Fleet Name", selector: (row) => row.name, sortable: true },
    {
      name: "Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      cell: (row) => (
        <Badge bg={row.status === 1 ? "success" : "secondary"}>
          {row.status === 1 ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      name: "Total Trucks",
      selector: (row) => row.trucks?.length || 0,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            size="sm"
            variant="info"
            className="me-2"
            onClick={() => openLinkTruckModal(row)}
          >
            Link Trucks
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditFleetForm({
                id: row.id,
                name: row.name,
                status: row.status,
              });
              setShowEditFleetModal(true);
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  // --- Expandable Row Component ---
  const ExpandableComponent = ({ data }) => {
    if (!data.trucks || data.trucks.length === 0)
      return <p className="p-2">No trucks linked.</p>;
    return (
      <div className="p-2 bg-light">
        <h5 className="mb-2">Linked Trucks for {data.name}</h5>
        <DataTable
          columns={[
            { name: "Truck No", selector: (row) => row.truck_no },
            { name: "Brand", selector: (row) => row.truck_brand },
            { name: "Capacity", selector: (row) => row.capacity },
            {
              name: "Status",
              selector: (row) => row.status,
              cell: (row) => (
                <Badge bg={row.status === "active" ? "success" : "secondary"}>
                  {row.status}
                </Badge>
              ),
            },
          ]}
          data={data.trucks}
          noHeader
          dense
          pagination={false}
          highlightOnHover
          striped
          customStyles={{
            rows: { style: { border: "1px solid #dee2e6" } },
            headCells: {
              style: { borderBottom: "1px solid #dee2e6", fontWeight: "bold" },
            },
            cells: { style: { borderBottom: "1px solid #dee2e6" } },
          }}
        />
      </div>
    );
  };

  return (
    <div className="content mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3>Fleet Management</h3>
        <Button onClick={() => setShowAddFleetModal(true)}>Add Fleet</Button>
      </div>

      <div style={{ border: "1px solid #d3cccc", borderRadius: "7px" }}>
        <DataTable
          columns={columns}
          data={fleets || []}
          expandableRows
          expandableRowsComponent={ExpandableComponent}
          expandOnRowClicked
          expandableRowExpanded={(row) => expandedRows[row.id] || false}
          onRowExpandToggled={(toggled) =>
            setExpandedRows((prev) => ({
              ...prev,
              [toggled.id]: !prev[toggled.id],
            }))
          }
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div className="p-3 text-muted">No fleets found.</div>
          }
          customStyles={{
            rows: { style: { border: "1px solid #dee2e6" } },
            headCells: {
              style: { borderBottom: "1px solid #dee2e6", fontWeight: "bold" },
            },
            cells: { style: { borderBottom: "1px solid #dee2e6" } },
          }}
        />
      </div>

      {/* --- Add Fleet Modal --- */}
      <Modal
        show={showAddFleetModal}
        onHide={() => setShowAddFleetModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Fleet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Fleet Name</Form.Label>
            <Form.Control
              type="text"
              value={newFleetName}
              onChange={(e) =>
                setNewFleetName(
                  e.target.value
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                )
              }
              style={{ textTransform: "capitalize" }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddFleetModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleAddFleet}>
            Add Fleet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Link Trucks Modal --- */}
      <Modal
        show={showLinkTruckModal}
        onHide={() => setShowLinkTruckModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Link Trucks to {selectedFleet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!fleetTrucksData ? (
            <p>Loading trucks...</p>
          ) : (
            <div className="d-flex flex-column">
              <h5>Linked Trucks</h5>
              {fleetTrucksData.linkedTrucks?.map((truck) => (
                <Form.Check
                  key={truck.id}
                  type="checkbox"
                  checked={selectedTrucks.includes(truck.id)}
                  onChange={() => handleTruckCheckbox(truck.id)}
                  label={
                    <span>
                      {truck.truck_no} - {truck.truck_brand} - capacity:{" "}
                      {truck.capacity} <strong>(Linked)</strong>
                    </span>
                  }
                  className="m-2"
                />
              ))}

              <h5 className="mt-3">Available Trucks</h5>
              {fleetTrucksData.freeTrucks?.map((truck) => (
                <Form.Check
                  key={truck.id}
                  type="checkbox"
                  checked={selectedTrucks.includes(truck.id)}
                  onChange={() => handleTruckCheckbox(truck.id)}
                  label={`${truck.truck_no} - ${truck.truck_brand} - capacity: ${truck.capacity}`}
                  className="m-2"
                />
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLinkTruckModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleLinkTrucks}>
            Save Links
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Edit Fleet Modal --- */}
      <Modal
        show={showEditFleetModal}
        onHide={() => setShowEditFleetModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Fleet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fleet Name</Form.Label>
              <Form.Control
                type="text"
                value={editFleetForm.name}
                onChange={(e) =>
                  setEditFleetForm({ ...editFleetForm, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editFleetForm.status}
                onChange={(e) =>
                  setEditFleetForm({
                    ...editFleetForm,
                    status: Number(e.target.value),
                  })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditFleetModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateFleet}>
            Update Fleet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FleetManagement;
