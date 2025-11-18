import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Accordion,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import useCompanyDriverStore from "../store/companyDriverStore";
import { useCountryStateStore } from "../store/countryStateStore";

const AddDriverModal = ({
  showAddModal,
  setShowAddModal,
  newDriver,
  setNewDriver,
  handleAddDriver,
}) => {
  const { loading, error } = useCompanyDriverStore();
  const { countries, states, fetchAllCountries, fetchStatesByCountry } =
    useCountryStateStore();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        await fetchAllCountries();
      } catch (err) {
        toast.error(err.message || "Failed to load countries");
      }
    };

    loadCountries();
  }, [fetchAllCountries]);

  useEffect(() => {
    if (!newDriver.country) return;

    const loadStates = async () => {
      try {
        await fetchStatesByCountry(newDriver.country);
      } catch (err) {
        toast.error(err.message || "Failed to load states");
      }
    };

    loadStates();
  }, [newDriver.country, fetchStatesByCountry]);
  const [errors, setErrors] = useState({});


  const onSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleAddDriver();
  };

  const validateForm = () => {
    const newErrors = {};
    // Personal Details validation
    if (!newDriver?.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!newDriver?.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!newDriver?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(newDriver.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (newDriver?.email && !/\S+@\S+\.\S+/.test(newDriver.email)) {
      newErrors.email = 'Email is invalid';
    }
    // License Details validation
    if (!newDriver?.license?.trim()) newErrors.license = 'License number is required';
    if (!newDriver?.country?.trim()) newErrors.country = 'Country is required';
    if (!newDriver?.state?.trim()) newErrors.state = 'State/Province is required';
    if (newDriver?.expiry_date && new Date(newDriver.expiry_date) < new Date()) {
      newErrors.expiry_date = 'License cannot be expired';
    }
    // Driver Type validation
    if (!newDriver?.driver_type?.trim()) newErrors.driver_type = 'Driver type is required';
    // HOS & ELD Details validation
    if (!newDriver?.timezone?.trim()) newErrors.timezone = 'Time zone is required';
    return newErrors;
  };

  const onChange = (e) => {
    //some fields are boolean, select, normal input, date
    const { name, value } = e.target;
    if (name === "yard_moves" || name === "personal_cmv") {
      setNewDriver((prev) => ({ ...prev, [name]: !prev[name] }));
    } else {
      setNewDriver((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const stateOptions = {
    India: ["Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat"],
    USA: ["California", "Texas", "New York", "Florida"],
    Canada: [
      "Ontario",
      "Quebec",
      "British Columbia",
      "Alberta",
      "Prince Edward",
    ],
  };

  return (
    <Modal
      show={showAddModal}
      onHide={() => setShowAddModal(false)}
      size="lg"
      scrollable
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-success">
          <i className="bi bi-pencil"></i> Add Driver
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
                      isInvalid={!!errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="last_name"
                      placeholder="Last Name"
                      size="sm"
                      value={newDriver?.last_name}
                      onChange={onChange}
                      isInvalid={!!errors.last_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.last_name}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      name="phone"
                      placeholder="Phone Number"
                      size="sm"
                      value={newDriver?.phone}
                      onChange={onChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      size="sm"
                      value={newDriver?.email}
                      onChange={onChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
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
                      isInvalid={!!errors.license}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.license}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6} lg={3}>
                    <Form.Select
                      name="country"
                      className="form-select-md"
                      value={newDriver.country}
                      onChange={onChange}
                      isInvalid={!!errors.country}
                    >
                      <option value="">Select Country</option>
                      {countries?.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} lg={3}>
                    <Form.Select
                      name="state"
                      className="form-select-md"
                      value={newDriver.state}
                      onChange={onChange}
                      isInvalid={!!errors.state}
                    >
                      <option value="">Select State / Province</option>
                      {states?.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.state}
                    </Form.Control.Feedback>
                  </Col>

                  <Col md={6} lg={3}>
                    <Form.Control
                      type="date"
                      size="sm"
                      name="expiry_date"
                      value={newDriver?.expiry_date}
                      onChange={onChange}
                      isInvalid={!!errors.expiry_date}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.expiry_date}
                    </Form.Control.Feedback>
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
                  name="driver_type"
                  size="sm"
                  value={newDriver?.driver_type}
                  onChange={onChange}
                  isInvalid={!!errors.driver_type}
                >
                  <option value="">Select Driver Type</option>
                  <option value="company_driver">Company Driver</option>
                  <option value="owner_operator">Owner Operator</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.driver_type}
                </Form.Control.Feedback>
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
                      isInvalid={!!errors.canadian_hos}
                    >
                      <option value="70_7">70 hour / 7 Day</option>
                      <option value="120_14">120 hour / 14 Day</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.canadian_hos}
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={6}>
                    <Form.Select
                      name="us_hos"
                      size="sm"
                      value={newDriver?.us_hos}
                      onChange={onChange}
                      isInvalid={!!errors.us_hos}
                    >
                      <option value="70_8">70 hour / 8 Day</option>
                      <option value="60_7">60 hour / 7 Day</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.us_hos}
                    </Form.Control.Feedback>
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
                    isInvalid={!!errors.timezone}
                  >
                    <option value="">Select Time Zone</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="AKST">Alaska Time (AKST)</option>
                    <option value="HAST">Hawaii–Aleutian Time (HAST)</option>
                    <option value="NST">Newfoundland Time (NST)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.timezone}
                  </Form.Control.Feedback>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Submit Button */}
          <div className="mt-3 text-end">
            <Button
              type="submit"
              variant="success"
              size="sm"
              className="px-3"
              disabled={loading}
            >
              <i className="bi bi-save"></i> Save Driver
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDriverModal;
