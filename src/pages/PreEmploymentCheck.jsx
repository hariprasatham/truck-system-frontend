import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import usePreEmploymentApplicationStore from "../store/preEmploymentApplicationStore";
import { useNavigate, useLocation } from "react-router-dom";

const PreEmploymentCheck = () => {
  const initialFormData = {
    application_date: "",
    full_name: "",
    social_insurance: "",
    country_of_birth: "",
    nationality: "",
    passport_number: "",
    proof_of_age: true,
    address: "",
    city: "",
    province: "",
    postal_code: "",
    daytime_phone: "",
    emergency_phone: "",
    email: "",
    wcb_account_no: "",
    gst_no: "",
    previous_address: "",
    previous_city: "",
    previous_province: "",
    previous_postal: "",
    previous_work_from: "",
    previous_work_to: "",
    previous_position: "",
    presently_employed: true,
    last_position_length: "",
    hear_about: "",
    expected_pay_rate: "",
    driver_license_number: "",
    license_issuing_province: "",
    license_class: "",
    license_issue_date: "",
    license_expiry_date: "",
    license_denied: false,
    license_suspended: false,
    applied_other_province: "",
    still_hold_other: false,
    position_applied: "",
    experience_years: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    createApplication,
    currentApplication,
    fetchApplicationById,
    updateApplication,
  } = usePreEmploymentApplicationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.application_date)
      newErrors.application_date = "Application date is required";
    if (!formData.full_name?.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.social_insurance?.trim())
      newErrors.social_insurance = "Social insurance number is required";
    if (!formData.country_of_birth?.trim())
      newErrors.country_of_birth = "Country of birth is required";
    if (!formData.nationality?.trim())
      newErrors.nationality = "Nationality is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.province?.trim()) newErrors.province = "Province is required";
    if (!formData.postal_code?.trim())
      newErrors.postal_code = "Postal code is required";
    if (!formData.daytime_phone?.trim())
      newErrors.daytime_phone = "Daytime phone is required";
    if (!formData.emergency_phone?.trim())
      newErrors.emergency_phone = "Emergency phone is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.driver_license_number?.trim())
      newErrors.driver_license_number = "Driver license number is required";
    if (!formData.license_issuing_province?.trim())
      newErrors.license_issuing_province = "Issuing province is required";
    if (!formData.license_class?.trim())
      newErrors.license_class = "License class is required";
    if (!formData.license_issue_date)
      newErrors.license_issue_date = "Issue date is required";
    if (!formData.license_expiry_date)
      newErrors.license_expiry_date = "Expiry date is required";
    if (!formData.position_applied?.trim())
      newErrors.position_applied = "Position applied is required";
    if (formData.experience_years === "")
      newErrors.experience_years = "Years of experience is required";
    if (!formData.presently_employed)
      newErrors.presently_employed = "Presently employed is required";

    // Custom validations
    if (
      formData.social_insurance &&
      !/^\d{3}-\d{3}-\d{3}$/.test(formData.social_insurance)
    ) {
      newErrors.social_insurance = "Invalid SIN format (XXX-XXX-XXX)";
    }
    if (
      formData.postal_code &&
      !/^(?:\d{6}|[A-Za-z0-9]{6})$/.test(formData.postal_code)
    ) {
      newErrors.postal_code = "Invalid postal code format (e.g., A1A 1A1)";
    }
    if (formData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format (XXX-XXX-XXXX)";
    }
    if (
      formData.license_issue_date &&
      formData.license_expiry_date &&
      new Date(formData.license_issue_date) >
        new Date(formData.license_expiry_date)
    ) {
      newErrors.license_expiry_date = "Expiry date must be after issue date";
    }

    return newErrors;
  };

  useEffect(() => {
    if (location.state?.applicationId) {
      fetchApplicationById(location.state.applicationId);
    }
  }, [location.state?.applicationId]);

  useEffect(() => {
    if (currentApplication) {
      const formattedApplication = {
        ...currentApplication,
        application_date: currentApplication.application_date
          ? new Date(currentApplication.application_date)
              .toISOString()
              .split("T")[0]
          : "",
        license_issue_date: currentApplication.license_issue_date
          ? new Date(currentApplication.license_issue_date)
              .toISOString()
              .split("T")[0]
          : "",
        license_expiry_date: currentApplication.license_expiry_date
          ? new Date(currentApplication.license_expiry_date)
              .toISOString()
              .split("T")[0]
          : "",
      };
      setFormData(formattedApplication);
    }
  }, [currentApplication]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    console.log(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        setLoading(true);
        if (location.state?.applicationId) {
          if (formData.hasOwnProperty("id")) delete formData.id;
          if (formData.hasOwnProperty("pdf_file")) delete formData.pdf_file;
          if (formData.hasOwnProperty("createdAt")) delete formData.createdAt;
          if (formData.hasOwnProperty("updatedAt")) delete formData.updatedAt;

          console.log(formData);

          await updateApplication(location.state.applicationId, formData);
        } else {
          await createApplication(formData);
        }
        setFormData(initialFormData);
        navigate("/pre-employment-application");
        // Optionally show success message or redirect
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle API error (e.g., show error message to user)
      } finally {
        setLoading(false); // 🔹 stop loader (safe even if error)
      }
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }
  };

  return (
    <div className="content flex-grow-1">
      <Container className="mt-3">
        <h3 className="text-success mb-4">
          Driver Employment / Pre-Employment Application
        </h3>

        <Form
          onSubmit={handleSubmit}
          className="p-4 border rounded bg-white shadow-sm"
        >
          <Row className="g-3">
            {/* Date & Name */}
            <Col md={4}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                isInvalid={!!errors.application_date}
                className={errors.application_date ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.application_date}
              </Form.Control.Feedback>
            </Col>
            <Col md={8}>
              <Form.Label>Full Name (F/M/L)</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                isInvalid={!!errors.full_name}
                className={errors.full_name ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.full_name}
              </Form.Control.Feedback>
            </Col>

            {/* Personal Details */}
            <Col md={4}>
              <Form.Label>Social Insurance Number</Form.Label>
              <Form.Control
                type="text"
                name="social_insurance"
                value={formData.social_insurance}
                onChange={handleChange}
                placeholder="XXX-XXX-XXX"
                isInvalid={!!errors.social_insurance}
                className={errors.social_insurance ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.social_insurance}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Country of Birth</Form.Label>
              <Form.Control
                type="text"
                name="country_of_birth"
                value={formData.country_of_birth}
                onChange={handleChange}
                isInvalid={!!errors.country_of_birth}
                className={errors.country_of_birth ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.country_of_birth}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Nationality</Form.Label>
              <Form.Control
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                isInvalid={!!errors.nationality}
                className={errors.nationality ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nationality}
              </Form.Control.Feedback>
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
                <option value={true}>Yes</option>
                <option value={false}>No</option>
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
                isInvalid={!!errors.province}
                className={errors.province ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.province}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                placeholder="A1A 1A1"
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                isInvalid={!!errors.postal_code}
                className={errors.postal_code ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.postal_code}
              </Form.Control.Feedback>
            </Col>

            {/* Contact */}
            <Col md={4}>
              <Form.Label>Daytime Phone</Form.Label>
              <Form.Control
                type="text"
                name="daytime_phone"
                value={formData.daytime_phone}
                onChange={handleChange}
                placeholder="XXX-XXX-XXXX"
                isInvalid={!!errors.daytime_phone}
                className={errors.daytime_phone ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.daytime_phone}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Emergency Phone</Form.Label>
              <Form.Control
                type="text"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={handleChange}
                placeholder="XXX-XXX-XXXX"
                isInvalid={!!errors.emergency_phone}
                className={errors.emergency_phone ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.emergency_phone}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                isInvalid={!!errors.email}
                className={errors.email ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Col>

            <Col md={4}>
              <Form.Label>WCB Account No.</Form.Label>
              <Form.Control
                type="text"
                name="wcb_account_no"
                value={formData.wcb_account_no}
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
                isInvalid={!!errors.presently_employed}
                className={errors.presently_employed ? "is-invalid" : ""}
              >
                <option value="">Select</option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.presently_employed}
              </Form.Control.Feedback>
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
                isInvalid={!!errors.driver_license_number}
                className={errors.driver_license_number ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.driver_license_number}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Issuing Province</Form.Label>
              <Form.Control
                type="text"
                name="license_issuing_province"
                value={formData.license_issuing_province}
                onChange={handleChange}
                isInvalid={!!errors.license_issuing_province}
                className={errors.license_issuing_province ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.license_issuing_province}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Class</Form.Label>
              <Form.Control
                type="text"
                name="license_class"
                value={formData.license_class}
                onChange={handleChange}
                isInvalid={!!errors.license_class}
                className={errors.license_class ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.license_class}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="license_issue_date"
                value={formData.license_issue_date}
                onChange={handleChange}
                isInvalid={!!errors.license_issue_date}
                className={errors.license_issue_date ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.license_issue_date}
              </Form.Control.Feedback>
            </Col>
            <Col md={4}>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                name="license_expiry_date"
                value={formData.license_expiry_date}
                onChange={handleChange}
                isInvalid={!!errors.license_expiry_date}
                className={errors.license_expiry_date ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.license_expiry_date}
              </Form.Control.Feedback>
            </Col>

            <Col md={6}>
              <Form.Label>Ever been denied a license?</Form.Label>
              <Form.Select
                name="license_denied"
                value={formData.license_denied}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value={false}>No</option>
                <option value={true}>Yes</option>
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
                <option value={false}>No</option>
                <option value={true}>Yes</option>
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
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Position Applied</Form.Label>
              <Form.Control
                type="text"
                name="position_applied"
                value={formData.position_applied}
                onChange={handleChange}
                isInvalid={!!errors.position_applied}
                className={errors.position_applied ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.position_applied}
              </Form.Control.Feedback>
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
                isInvalid={!!errors.experience_years}
                className={errors.experience_years ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {errors.experience_years}
              </Form.Control.Feedback>
            </Col>
          </Row>

          <div className="mt-4 d-flex align-items-center gap-3">
  <Button
    type="submit"
    variant="success"
    disabled={loading}
  >
    {loading ? (
      <>
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
        Processing...
      </>
    ) : location.state?.applicationId ? (
      <>
        <i className="bi bi-file-earmark-text"></i> Update & Generate PDF
      </>
    ) : (
      <>
        <i className="bi bi-file-earmark-text"></i> Save & Generate PDF
      </>
    )}
  </Button>
</div>


          {/* <div className="mt-4">
            {location.state?.applicationId ? (
              <Button type="submit" variant="success">
                <i className="bi bi-file-earmark-text"></i> Update & Generate
                PDF
              </Button>
            ) : (
              <Button type="submit" variant="success">
                <i className="bi bi-file-earmark-text"></i> Save & Generate PDF
              </Button>
            )}
          </div> */}
        </Form>
      </Container>
    </div>
  );
};

export default PreEmploymentCheck;
