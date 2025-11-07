import React, { useState } from 'react'
import { Modal, Button, Form, Accordion, Row, Col, Alert } from 'react-bootstrap'

import useCompanyDriverStore from '../store/companyDriverStore'

const EditDriverModal = ({ 
  showEditModal, 
  setShowEditModal, 
  newDriver = {}, 
  setNewDriver, 
  handleEditDriver 
}) => {
  // Initialize newDriver as an empty object if undefined
  const safeNewDriver = newDriver || {};

  const { loading, error } = useCompanyDriverStore() || {};



  const onSubmit = (e) => {
    e.preventDefault();
    if (handleEditDriver) {
      handleEditDriver();
    }
  };

  const onChange = (e) => {
    //some fields are boolean, select, normal input, date
    const { name, value } = e.target;

    if (name === "yard_moves" || name === "personal_cmv") {
      setNewDriver((prev) => ({ ...(prev || {}), [name]: !(prev?.[name] || false) }));
    } else {
      setNewDriver((prev) => ({ ...(prev || {}), [name]: value }));
    }


  };

  console.log('Modal show state:', showEditModal);
console.log('Current driver data:', safeNewDriver);


  return (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      size="lg"
      scrollable
      centered
      backdrop="static"
      style={{ zIndex: 9999 }} 
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-success">
          <i className="bi bi-pencil"></i> Edit Driver
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form onSubmit={onSubmit}>
          <Accordion defaultActiveKey="0" id="driverAccordion">

            {/* Personal Details */}
            <Accordion.Item eventKey="0" className="border-light-green">
              <Accordion.Header className="bg-light-green">
                Personal Details
              </Accordion.Header>
              <Accordion.Body>
                <Row className="g-2">
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="first_name"
                      placeholder="First Name"
                      size="sm"
                      value={newDriver?.first_name}
                      onChange={onChange}
                      required
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="last_name"
                      placeholder="Last Name"
                      size="sm"
                      value={newDriver?.last_name}
                      onChange={onChange}
                      required
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="phone"
                      placeholder="Phone Number"
                      size="sm"
                      value={newDriver?.phone}
                      onChange={onChange}
                      required
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      size="sm"
                      value={newDriver?.email}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* License Details */}
            <Accordion.Item eventKey="1" className="border-light-green">
              <Accordion.Header className="bg-light-green">
                License Details
              </Accordion.Header>
              <Accordion.Body>
                <Row className="g-2">
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="license"
                      placeholder="License Number"
                      size="sm"
                      value={newDriver?.license}
                      onChange={onChange}
                      required
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Select
                      name="country"
                      size="sm"
                      value={newDriver?.country}
                      onChange={onChange}
                      required
                    >
                      <option value="">Select Country</option>
                      <option>India</option>
                      <option>USA</option>
                      <option>Canada</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Select
                      name="state"
                      size="sm"
                      value={newDriver?.state}
                      onChange={onChange}
                      required
                    >
                      <option value="">State/Province</option>
                      <option>Maharashtra</option>
                      <option>Ontario</option>
                      <option>California</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      type="date"
                      name="expiry_date"
                      size="sm"
                      value={newDriver?.expiry_date}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* Driver Type */}
            <Accordion.Item eventKey="2" className="border-light-green">
              <Accordion.Header className="bg-light-green">
                Driver Type
              </Accordion.Header>
              <Accordion.Body>
                <Form.Select
                  name="dispatcher"
                  size="sm"
                  value={newDriver?.dispatcher}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Driver Type</option>
                  <option>owner</option>
                  <option>operator</option>
                </Form.Select>
              </Accordion.Body>
            </Accordion.Item>

            {/* HOS & ELD Details */}
            <Accordion.Item eventKey="3" className="border-light-green">
              <Accordion.Header className="bg-light-green">
                HOS & ELD Details
              </Accordion.Header>
              <Accordion.Body>
                <Row className="g-2">
                  <Col md={6}>
                    <Form.Select
                      name="canadian_hos"
                      size="sm"
                      value={newDriver?.canadian_hos}
                      onChange={onChange}
                    >
                      <option value="70_7">70 hour / 7 Day</option>
                      <option value="120_14">120 hour / 14 Day</option>
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Select
                      name="us_hos"
                      size="sm"
                      value={newDriver?.us_hos}
                      onChange={onChange}
                    >
                      <option value="70_8">70 hour / 8 Day</option>
                      <option value="60_7">60 hour / 7 Day</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Form.Check
                  className="mt-2"
                  type="checkbox"
                  label="Yard Moves"
                  name="yard_moves"
                  checked={newDriver?.yard_moves}
                  onChange={onChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Personal Use CMV"
                  name="personal_cmv"
                  checked={newDriver?.personal_cmv}
                  onChange={onChange}
                />

                <div className="mt-2">
                  <Form.Label>Time Zone</Form.Label>
                  <Form.Select
                    name="timezone"
                    size="sm"
                    value={newDriver?.timezone}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select Time Zone</option>
                    <option value="EST">Eastern Time (Toronto)</option>
                    <option value="IST">India Standard Time</option>
                  </Form.Select>
                </div>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>

          {/* Submit Button */}
          <div className="mt-3 text-end">
            <Button type="submit" variant="success" size="sm" className="px-3" disabled={loading}>
              <i className="bi bi-save"></i> Update Driver
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default EditDriverModal