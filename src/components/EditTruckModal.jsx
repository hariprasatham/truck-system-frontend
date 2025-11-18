import React, { useState, useEffect } from "react";
import { Modal, Accordion } from "react-bootstrap";

const EditTruckModal = ({
  showEdit,
  setShowEdit,
  handleEdit,
  editData,

  formData,
  setFormData,
}) => {
  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamically handle visibility for type sections
  useEffect(() => {
    if (!formData) return;
    const { equipment_type } = formData;
    const truckTypeDiv = document.getElementById("truckTypeDiv");
    const trailerTypeDiv = document.getElementById("trailerTypeDiv");
    const forkliftTypeDiv = document.getElementById("forkliftTypeDiv");

    if (truckTypeDiv && trailerTypeDiv && forkliftTypeDiv) {
      truckTypeDiv.classList.add("d-none");
      trailerTypeDiv.classList.add("d-none");
      forkliftTypeDiv.classList.add("d-none");

      if (equipment_type === "Truck") truckTypeDiv.classList.remove("d-none");
      if (equipment_type === "Trailer")
        trailerTypeDiv.classList.remove("d-none");
      if (equipment_type === "Forklift")
        forkliftTypeDiv.classList.remove("d-none");
    }
  }, [formData?.equipment_type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit(formData);
  };

  const handleClose = () => {
    setShowEdit(false);
    setFormData({
      truck_no: "",
      truck_brand: "",
      equipment_type: "",
      sub_type: "",
      truck_ownership: "",
      model: "",
      capacity: "",
      status: "",
    });
  };

  const handleExited = () => {
    setFormData({
      truck_no: "",
      truck_brand: "",
      equipment_type: "",
      sub_type: "",
      truck_ownership: "",
      model: "",
      capacity: "",
      status: "",
    });
  };

  return (
    <div
      className="modal fade"
      id="addTruckModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <Modal
        size="lg"
        show={showEdit}
        onHide={handleClose}
        onExited={handleExited}
      >
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Equipment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Accordion defaultActiveKey="0" id="truckAccordion">
                {/* Equipment Information */}
                <Accordion.Item eventKey="0" className="accordion-item">
                  <Accordion.Header
                    className="accordion-header"
                    id="headingOne"
                  >
                    Equipment Information
                  </Accordion.Header>

                  <Accordion.Body className="accordion-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label>Equipment Number</label>
                        <input
                          type="text"
                          name="truck_no"
                          className="form-control"
                          placeholder="Enter Truck Number"
                          value={formData?.truck_no}
                          // onChange={handleChange}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "truck_no",
                                value: e.target.value.toUpperCase(), // 🔥 Always uppercase
                              },
                            })
                          }
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label>Equipment Brand</label>
                        <select
                          name="truck_brand"
                          className="form-control"
                          value={formData?.truck_brand}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Brand --</option>
                          <option value="Ford">Ford</option>
                          <option value="Volvo">Volvo</option>
                          <option value="Kenworth">Kenworth</option>
                          <option value="Peterbilt">Peterbilt</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label>Equipment Type</label>
                        <select
                          name="equipment_type"
                          className="form-control"
                          value={formData?.equipment_type}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Equipment Type --</option>
                          <option value="Truck">Truck</option>
                          <option value="Trailer">Trailer</option>
                          <option value="Forklift">Forklift</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label>VIN Number</label>
                        <input
                          type="text"
                          name="vin_number"
                          className="form-control"
                          placeholder="Enter Vin Number"
                          value={formData.vin_number}
                          // onChange={handleChange}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "vin_number",
                                value: e.target.value.toUpperCase(), // 🔥 Always uppercase
                              },
                            })
                          }
                          required
                        />
                      </div>

                      {/* Truck Type */}
                      <div className="col-md-6 d-none" id="truckTypeDiv">
                        <label>Truck Type</label>
                        <select
                          name="sub_type"
                          className="form-control"
                          value={formData?.sub_type}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Truck Type --</option>
                          <option value="Local">Local</option>
                          <option value="Highway">Highway</option>
                        </select>
                      </div>

                      {/* Trailer Type */}
                      <div className="col-md-6 d-none" id="trailerTypeDiv">
                        <label>Trailer Type</label>
                        <select
                          name="sub_type"
                          className="form-control"
                          value={formData?.sub_type}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Trailer --</option>
                          <option value="Flatbed">Flatbed</option>
                          <option value="Refrigerated">Refrigerated</option>
                          <option value="Tanker">Tanker</option>
                          <option value="Lowboy">Lowboy</option>
                        </select>
                      </div>

                      {/* Forklift Type */}
                      <div className="col-md-6 d-none" id="forkliftTypeDiv">
                        <label>Forklift Type</label>
                        <select
                          name="sub_type"
                          className="form-control"
                          value={formData?.sub_type}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Equipment --</option>
                          <option value="Counterbalance Forklifts">
                            Counterbalance Forklifts
                          </option>
                          <option value="Electric 3-Wheel Forklifts">
                            Electric 3-Wheel Forklifts
                          </option>
                          <option value="Reach Trucks">Reach Trucks</option>
                          <option value="Pallet Jacks (Manual & Electric)">
                            Pallet Jacks (Manual & Electric)
                          </option>
                          <option value="Telehandlers">
                            Telehandlers (Telescopic Forklifts)
                          </option>
                          <option value="Rough Terrain Forklifts">
                            Rough Terrain Forklifts
                          </option>
                          <option value="Side Loader Forklifts">
                            Side Loader Forklifts
                          </option>
                          <option value="Yard Spotter with Integrated Forklift">
                            Yard Spotter with Integrated Forklift
                          </option>
                        </select>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Model Details */}
                <Accordion.Item eventKey="1" className="accordion-item">
                  <Accordion.Header>Equipment / Model Details</Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label>Truck Ownership Type</label>
                        <select
                          name="truck_ownership"
                          className="form-control"
                          value={formData?.truck_ownership}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Truck Ownership --</option>
                          <option value="Owner">Owner</option>
                          <option value="Operator">Operator</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label>Model</label>
                        <input
                          type="text"
                          name="model"
                          className="form-control"
                          value={formData?.model}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label>Capacity</label>
                        <input
                          type="text"
                          name="capacity"
                          className="form-control"
                          value={formData?.capacity}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Status Section */}
                <Accordion.Item eventKey="2" className="accordion-item">
                  <Accordion.Header
                    className="accordion-header"
                    id="headingThree"
                  >
                    Assign Equipment Status
                  </Accordion.Header>

                  <Accordion.Body className="accordion-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label>Status</label>
                        <select
                          name="status"
                          className="form-control"
                          value={formData?.status}
                          onChange={handleChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer>
              <button type="submit" className="btn btn-success">
                Update
              </button>
            </Modal.Footer>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default EditTruckModal;
