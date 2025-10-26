import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";

const PreEmploymentCheck = () => {
  const initialFormData = {
    application_date: "",
    full_name: "",
    social_insurance: "",
    country_of_birth: "",
    nationality: "",
    passport_number: "",
    proof_of_age: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    daytime_phone: "",
    emergency_phone: "",
    email: "",
    wcb_account: "",
    gst_no: "",
    previous_address: "",
    previous_city: "",
    previous_province: "",
    previous_postal: "",
    previous_work_from: "",
    previous_work_to: "",
    previous_position: "",
    presently_employed: "",
    last_position_length: "",
    hear_about: "",
    expected_pay_rate: "",
    driver_license_number: "",
    license_issuing_province: "",
    license_class: "",
    license_issue_date: "",
    license_expiry_date: "",
    license_denied: "",
    license_suspended: "",
    applied_other_province: "",
    still_hold_other: "",
    position_applied: "",
    experience_years: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [applications, setApplications] = useState([{id:1, full_name:"John M Doe", application_date:"2024-06-01", position_applied:"Driver", pdf_path:"#"}]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newApp = {
      id: applications.length + 1,
      ...formData,
      pdf_path: "#",
    };

    setApplications([newApp, ...applications]);
    alert("Form saved successfully!");

    // Reset form
    setFormData(initialFormData);
  };

  return (
    <div className="content flex-grow-1">
      <Container className="mt-3">
        <h3 className="text-success mb-4">
          Driver Employment / Pre-Employment Application
        </h3>

        <Form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
          <Row className="g-3">
            {/* Date & Name */}
            <Col md={4}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
              />
            </Col>
            <Col md={8}>
              <Form.Label>Full Name (F/M/L)</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </Col>

            {/* Personal Details */}
            <Col md={4}>
              <Form.Label>Social Insurance Number</Form.Label>
              <Form.Control
                type="text"
                name="social_insurance"
                value={formData.social_insurance}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Country of Birth</Form.Label>
              <Form.Control
                type="text"
                name="country_of_birth"
                value={formData.country_of_birth}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Nationality</Form.Label>
              <Form.Control
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Passport #</Form.Label>
              <Form.Control
                type="text"
                name="passport_number"
                value={formData.passport_number}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Can you provide proof of age?</Form.Label>
              <Form.Select
                name="proof_of_age"
                value={formData.proof_of_age}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Form.Select>
            </Col>

            {/* Address */}
            <Col md={12}>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Province</Form.Label>
              <Form.Control
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </Col>

            {/* Contact */}
            <Col md={4}>
              <Form.Label>Daytime Phone</Form.Label>
              <Form.Control
                type="text"
                name="daytime_phone"
                value={formData.daytime_phone}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Emergency Phone</Form.Label>
              <Form.Control
                type="text"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>WCB Account No.</Form.Label>
              <Form.Control
                type="text"
                name="wcb_account"
                value={formData.wcb_account}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>GST No.</Form.Label>
              <Form.Control
                type="text"
                name="gst_no"
                value={formData.gst_no}
                onChange={handleChange}
              />
            </Col>

            {/* Previous Employment */}
            <Col md={12}>
              <hr />
              <h6>Previous Address / Employment (if applicable)</h6>
            </Col>

            <Col md={12}>
              <Form.Label>Previous Address</Form.Label>
              <Form.Control
                type="text"
                name="previous_address"
                value={formData.previous_address}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Prev City</Form.Label>
              <Form.Control
                type="text"
                name="previous_city"
                value={formData.previous_city}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Prev Province</Form.Label>
              <Form.Control
                type="text"
                name="previous_province"
                value={formData.previous_province}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Prev Postal</Form.Label>
              <Form.Control
                type="text"
                name="previous_postal"
                value={formData.previous_postal}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Worked From</Form.Label>
              <Form.Control
                type="text"
                name="previous_work_from"
                value={formData.previous_work_from}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Worked To</Form.Label>
              <Form.Control
                type="text"
                name="previous_work_to"
                value={formData.previous_work_to}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="previous_position"
                value={formData.previous_position}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Presently Employed?</Form.Label>
              <Form.Select
                name="presently_employed"
                value={formData.presently_employed}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>If No, how long since last position?</Form.Label>
              <Form.Control
                type="text"
                name="last_position_length"
                value={formData.last_position_length}
                onChange={handleChange}
              />
            </Col>

            <Col md={4}>
              <Form.Label>Where did you hear about us?</Form.Label>
              <Form.Control
                type="text"
                name="hear_about"
                value={formData.hear_about}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Expected pay rate</Form.Label>
              <Form.Control
                type="text"
                name="expected_pay_rate"
                value={formData.expected_pay_rate}
                onChange={handleChange}
              />
            </Col>

            {/* Driver License */}
            <Col md={12}>
              <hr />
              <h6>Driver License</h6>
            </Col>

            <Col md={4}>
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                name="driver_license_number"
                value={formData.driver_license_number}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Issuing Province</Form.Label>
              <Form.Control
                type="text"
                name="license_issuing_province"
                value={formData.license_issuing_province}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Class</Form.Label>
              <Form.Control
                type="text"
                name="license_class"
                value={formData.license_class}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="license_issue_date"
                value={formData.license_issue_date}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="license_expiry_date"
                value={formData.license_expiry_date}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Label>Ever been denied a license?</Form.Label>
              <Form.Select
                name="license_denied"
                value={formData.license_denied}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>No</option>
                <option>Yes</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Ever suspended/revoked?</Form.Label>
              <Form.Select
                name="license_suspended"
                value={formData.license_suspended}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>No</option>
                <option>Yes</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Applied in other province?</Form.Label>
              <Form.Control
                type="text"
                name="applied_other_province"
                value={formData.applied_other_province}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Still hold that license?</Form.Label>
              <Form.Select
                name="still_hold_other"
                value={formData.still_hold_other}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>No</option>
                <option>Yes</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Position Applied</Form.Label>
              <Form.Control
                type="text"
                name="position_applied"
                value={formData.position_applied}
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>Years of Experience</Form.Label>
              <Form.Control
                type="number"
                name="experience_years"
                min="0"
                max="50"
                value={formData.experience_years}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="mt-4">
            <Button type="submit" variant="success">
              <i className="bi bi-file-earmark-text"></i> Save & Generate PDF
            </Button>
          </div>
        </Form>
      </Container>

      {/* Saved Applications Table */}
      <Container className="mt-5">
        <h4 className="text-success mb-3">Saved Applications</h4>
        <Table bordered striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Position</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No saved applications
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.full_name}</td>
                  <td>{app.application_date}</td>
                  <td>{app.position_applied}</td>
                  <td>
                    <a
                      href={app.pdf_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-success"
                    >
                      <i className="bi bi-file-earmark-pdf"></i> Download
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default PreEmploymentCheck;
