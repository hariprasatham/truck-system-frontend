import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Modal, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import useFleetStore from "../store/fleetStore";

const FleetManagement = () => {
  const {
    fleets,
    allTrucks,
    loading,
    fetchFleets,
    addFleet,
    fetchAllTrucksByCompanies,
    linkTrucks,
    updateFleet,
  } = useFleetStore();

  const [showFleetModal, setShowFleetModal] = useState(false);
  const [fleetForm, setFleetForm] = useState({ name: "", status: 1 });

  const [showLinkTruckModal, setShowLinkTruckModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedTrucks, setSelectedTrucks] = useState([]);

  const [showEditFleetModal, setShowEditFleetModal] = useState(false);
  const [editFleetForm, setEditFleetForm] = useState({
    id: null,
    name: "",
    status: 1,
  });
  const [expandedFleetId, setExpandedFleetId] = useState(null);

  const toggleExpandFleet = (fleetId) => {
    setExpandedFleetId(expandedFleetId === fleetId ? null : fleetId);
  };

  // Load fleets and trucks
  useEffect(() => {
    fetchFleets();
    fetchAllTrucksByCompanies();
  }, []);

  // Add Fleet
  const handleAddFleet = async () => {
    if (!fleetForm.name.trim()) {
      toast.error("Fleet name is required");
      return;
    }
    try {
      await addFleet(fleetForm);
      setShowFleetModal(false);
      setFleetForm({ name: "", status: 1 });
    } catch {}
  };

  // Open Link Trucks Modal
  const openLinkTruckModal = (fleet) => {
    setSelectedFleet(fleet);
    setSelectedTrucks(fleet.trucks?.map((t) => t.id) || []);
    setShowLinkTruckModal(true);
  };

  const openEditFleetModal = (fleet) => {
    setEditFleetForm({
      id: fleet.id,
      name: fleet.name,
      status: fleet.status,
    });
    setShowEditFleetModal(true);
  };

  const handleUpdateFleet = async () => {
    console.log("Updating fleet...", editFleetForm);
    console.log("Fleet ID:", editFleetForm.id);

    try {
      await updateFleet(editFleetForm.id, {
        name: editFleetForm.name,
        status: editFleetForm.status,
      });

      toast.success("Fleet updated!");
      setShowEditFleetModal(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleTruckCheckbox = (truckId) => {
    if (selectedTrucks.includes(truckId)) {
      setSelectedTrucks(selectedTrucks.filter((id) => id !== truckId));
    } else {
      setSelectedTrucks([...selectedTrucks, truckId]);
    }
  };

  const handleLinkTrucks = async () => {
    if (!selectedFleet) return;
    try {
      await linkTrucks(selectedFleet.id, selectedTrucks);
      setShowLinkTruckModal(false);
    } catch {}
  };

  const getStatusLabel = (status) => (status === 1 ? "Active" : "Inactive");
  const getStatusVariant = (status) => (status === 1 ? "success" : "secondary");

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Fleet Management</h3>
        <Button onClick={() => setShowFleetModal(true)}>Add Fleet</Button>
      </div>

      {/* Fleet Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>SL.No</th>
              <th>Fleet Name</th>
              <th>Status</th>
              {/* <th>Created By</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fleets?.length > 0 ? (
              fleets.map((fleet, i) => (
                <React.Fragment key={fleet.id}>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{fleet.name}</td>
                    <td>
                      <Badge bg={getStatusVariant(fleet.status)}>
                        {getStatusLabel(fleet.status)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        className="me-2"
                        onClick={() => openLinkTruckModal(fleet)}
                      >
                        Link Trucks
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="me-2"
                        onClick={() => openEditFleetModal(fleet)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => toggleExpandFleet(fleet.id)}
                      >
                        {expandedFleetId === fleet.id
                          ? "Hide Trucks"
                          : "View Trucks"}
                      </Button>
                    </td>
                  </tr>

                  {/* Accordion row for linked trucks */}
                  {expandedFleetId === fleet.id && (
                    <tr>
                      <td colSpan={4}>
                        {fleet.trucks && fleet.trucks.length > 0 ? (
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>SL.No</th>
                                <th>Truck No</th>
                                <th>Brand</th>
                                <th>Capacity</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fleet.trucks.map((truck, idx) => (
                                <tr key={truck.id}>
                                  <td>{idx + 1}</td>
                                  <td>{truck.truck_no}</td>
                                  <td>{truck.truck_brand}</td>
                                  <td>{truck.capacity}</td>
                                  <td>
                                    <Badge
                                      bg={
                                        truck.status === "active"
                                          ? "success"
                                          : "secondary"
                                      }
                                    >
                                      {truck.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No trucks linked to this fleet.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No fleets found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Add Fleet Modal */}
      <Modal show={showFleetModal} onHide={() => setShowFleetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Fleet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fleet Name</Form.Label>
              <Form.Control
                type="text"
                value={fleetForm.name}
                onChange={(e) =>
                  setFleetForm({ ...fleetForm, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={fleetForm.status}
                onChange={(e) =>
                  setFleetForm({ ...fleetForm, status: Number(e.target.value) })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFleetModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddFleet}>
            Save Fleet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Link Trucks Modal */}
      <Modal
        show={showLinkTruckModal}
        onHide={() => setShowLinkTruckModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Link Trucks to {selectedFleet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap">
            {allTrucks.length > 0 ? (
              allTrucks.map((truck) => (
                <Form.Check
                  key={truck.id}
                  type="checkbox"
                  id={`truck-${truck.id}`}
                  label={`${truck.truck_no} - (${truck.truck_brand} Capacity : ${truck.capacity} ) `}
                  checked={selectedTrucks.includes(truck.id)}
                  onChange={() => handleTruckCheckbox(truck.id)}
                  className="m-2"
                />
              ))
            ) : (
              <p>No trucks available</p>
            )}
          </div>
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

      {/* Edit Fleet Modal */}
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
