import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Table,
  Modal,
  Form,
  Accordion,
} from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import useCompanyDriverStore from "../store/companyDriverStore";
import MedicalReviewModal from "../components/MedicalReviewModal";
import toast from "react-hot-toast";
import GlobalLoader from "../components/GlobalLoader";
import Loader from "../components/Loader";


const DriverDetails = () => {
  //   const [driver, setDriver] = useState(null);
  const [driver, setDriver] = useState(null)
  const [reviews, setReviews] = useState([]);
  //   const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [medicalReport, setMedicalReport] = useState(null)
  const [driverLicense, setDriverLicense] = useState(null)
  const [province, setProvince] = useState(null)

  // /companies/:companyId/user-management/:userId/drivers/:driverId
  const { companyId, userId, driverId } = useParams()   
const [fileKey, setFileKey] = useState(Date.now());
  const { fetchDriverById, uploadMedicalReport, downloadMedicalReport, downloadLicense, loading, uploadDriverLicense } = useCompanyDriverStore()


  useEffect(() => {
    async function fetchData() {
      const driverData = await fetchDriverById(driverId)
      setDriver(driverData)
    }
    fetchData()
  }, [driverId])


  const handleDownloadMedicalReport = async (pdfPath) => {
    try {
      // 1️⃣ Call your API to get the PDF blob
      const medicalReport = await downloadMedicalReport(pdfPath);

      console.log("medicalReport", medicalReport)
      // Ensure your backend sets `responseType: 'blob'` in the axios call

      // 2️⃣ Create a Blob URL for the downloaded file
      const blob = new Blob([medicalReport], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // 3️⃣ Create an invisible link and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medical-report.pdf"); // or use dynamic filename if available
      document.body.appendChild(link);
      link.click();

      // 4️⃣ Cleanup
      link.remove();
      window.URL.revokeObjectURL(url); // revoke to free memory

      toast.success("Medical report downloaded successfully");
    } catch (error) {
      console.error("Error downloading medical report:", error);
      toast.error(
        error.response?.data?.message || "❌ Failed to download medical report"
      );
    }
  };

  const handleDownloadLicense = async (filePath) => {
    try {
      const fileBlob = await downloadLicense(filePath);

      // Determine the file type dynamically
      const fileType = filePath.endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg";
      const fileName = filePath.endsWith(".pdf")
        ? "license.pdf"
        : "license.jpg";

      const blob = new Blob([fileBlob], { type: fileType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("License downloaded successfully");
    } catch (error) {
      console.error("Error downloading license:", error);
      toast.error(
        error.response?.data?.message || "❌ Failed to download license"
      );
    }
  };

  const handleDrugTestPDFUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("drugReport", medicalReport);

    await uploadMedicalReport(driverId, formData)
    const driverData = await fetchDriverById(driverId)
    setDriver(driverData)
    setMedicalReport(null);
    setFileKey(Date.now());
  };

  const handleDriverLicenseUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("licenseDocument", driverLicense);
    //formData.append("province", province);
    formData.append("driverId", driverId);
    formData.append("companyId", companyId);

    await uploadDriverLicense(formData)
    const driverData = await fetchDriverById(driverId)
    setDriver(driverData)
    setDriverLicense(null);
    setFileKey(Date.now());
    setProvince(null);
  };

  const handleProvinceChange = (e) => {
    setProvince(e.target.value)
  }

  const openModal = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  return (
    <div className="content flex-grow-1 p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Driver Management</h3>
      </div>

      {loading && <Loader />}

      <Card className="shadow-sm p-4 mb-4">
        <h5 className="mb-3">
          <i className="bi bi-person-badge" /> Driver Details
        </h5>

        <Container>
          {/* Row 1 */}
          <Row>
            <InfoBox label="User ID" value={driver?.id} />
            <InfoBox label="First Name" value={driver?.first_name} />
            <InfoBox label="Last Name" value={driver?.last_name} />
            <InfoBox label="Phone" value={driver?.phone} />
          </Row>

          {/* Row 2 */}
          <Row>
            <InfoBox label="Email" value={driver?.email} />
            <InfoBox label="License" value={driver?.license} />
            <InfoBox label="Country" value={driver?.country} />
            <InfoBox label="State" value={driver?.state} />
          </Row>

          {/* Row 3 */}
          <Row>
            <InfoBox
              label="Expiry Date"
              value={
                driver?.expiry_date
                  ? new Date(driver?.expiry_date).toLocaleDateString()
                  : ""
              }
            />
            <InfoBox label="Dispatcher" value={driver?.dispatcher} />
            <InfoBox label="Canadian HOS" value={driver?.canadian_hos} />
            <InfoBox label="US HOS" value={driver?.us_hos} />
          </Row>

          {/* Row 4 */}
          <Row>
            <InfoBox label="Yard Moves" value={driver?.yard_moves == true ? "Allowed" : "Not Allowed"} />
            <InfoBox label="Status" value={driver?.status} />
            <InfoBox label="Personal CMV" value={driver?.personal_cmv == true ? "Allowed" : "Not Allowed"} />
            <InfoBox label="Timezone" value={driver?.timezone} />
          </Row>

          <hr />
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>License Details</Accordion.Header>
              <Accordion.Body>
                <Row>
                  <InfoBox label="Name" value={driver?.licenses?.[0]?.name} />
                  <InfoBox label="License Number" value={driver?.licenses?.[0]?.license_number} />
                  <InfoBox label="Issue Date" value={driver?.licenses?.[0]?.issue_date ? new Date(driver?.licenses?.[0]?.issue_date).toLocaleDateString() : ""} />
                  <InfoBox label="Expiry Date" value={driver?.licenses?.[0]?.expiry_date ? new Date(driver?.licenses?.[0]?.expiry_date).toLocaleDateString() : ""} />
                </Row>
                <Row>
                  <InfoBox label="DOB" value={driver?.licenses?.[0]?.dob ? new Date(driver?.licenses?.[0]?.dob).toLocaleDateString() : ""} />
                  <InfoBox label="Eyes Color" value={driver?.licenses?.[0]?.eye_color} />
                  <InfoBox label="Class" value={driver?.licenses?.[0]?.class} />
                  <InfoBox label="Sex" value={driver?.licenses?.[0]?.sex} />
                </Row>
                <Row>
                  <InfoBox label="height" value={driver?.licenses?.[0]?.height} />
                  <InfoBox label="Province" value={driver?.licenses?.[0]?.state} />
                  <InfoBox label="view" value={driver?.licenses?.[0]?.license_image} handleDownloadLicense={handleDownloadLicense} />
                  <InfoBox label="" value={""} />
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <hr />
          <h5>
            <i className="bi bi-file-pdf" /> Upload Driver License
          </h5>

          <Form onSubmit={handleDriverLicenseUpload} className="mt-3 row g-3 align-items-center">
            <input type="hidden" name="driver_id" value={driverId} />
            <Col md={8}>
              <Form.Control
              key={fileKey}
                type="file"
                name="pdf_file"
                onChange={(e) => setDriverLicense(e.target.files[0])}
                required
              />
            </Col>
            {/* <Col md={4}>
              <Form.Select aria-label="Default select example" onChange={handleProvinceChange}>
                <option>Select the province</option>
                <option value="Alberta">Alberta</option>
                <option value="British Columbia">British Columbia</option> 
                <option value="Manitoba">Manitoba</option>
                <option value="NewfoundlandandLabrador">Newfoundland and Labrador</option>
                <option value="NovaScotia">Nova Scotia</option>
                <option value="Ontario">Ontario</option>
                <option value="PrinceEdwardIsland">Prince Edward Island</option>
                <option value="Quebec">Quebec</option>
                <option value="NewBrunswick">New Brunswick</option>
                <option value="Saskatchewan">Saskatchewan</option>
              </Form.Select>
            </Col> */}
            <Col md={4} className="d-grid">
              <Button variant="success" type="submit">
                <i className="bi bi-upload" /> Upload PDF
              </Button>
            </Col>
          </Form>
          <hr />
          <h5>
            <i className="bi bi-file-pdf" /> Upload Drug Test PDF
          </h5>

          <Form onSubmit={handleDrugTestPDFUpload} className="mt-3 row g-3 align-items-center">
            <input type="hidden" name="driver_id" value={driverId} />
            <Col md={8}>
              <Form.Control
              key={fileKey}
                type="file"
                name="pdf_file"
                accept="application/pdf"
                onChange={(e) => setMedicalReport(e.target.files[0])}
                required
              />
            </Col>
            <Col md={4} className="d-grid">
              <Button variant="success" type="submit">
                <i className="bi bi-upload" /> Upload PDF
              </Button>
            </Col>
          </Form>
          <hr />

          {driver?.drug_test_pdf && (
            <div className="mt-3">
              <p className="fw-bold">Existing File:</p>
              <a
                href={driver.drug_test_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-danger"
              >
                <i className="bi bi-file-pdf" /> View PDF
              </a>
            </div>
          )}
        </Container>
      </Card>

      {/* Medical Reviews Table */}
      <Card className="shadow-sm p-3">
        <h5>
          <i className="bi bi-clipboard-data me-2"></i>Medical Reviews
        </h5>
        <div className="table-responsive">
          <Table bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Lab Account</th>
                <th>Donor Name</th>
                <th>Reason for Test</th>
                <th>Collection Date</th>
                <th>Overall Verification</th>
                <th>PDF</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {driver?.medicalReports?.length > 0 ? (
                driver?.medicalReports?.map((r, idx) => (
                  <tr key={r.id}>
                    <td>{r.lab_account}</td>
                    <td>{r.donor_name}</td>
                    <td>{r.reason_for_test}</td>
                    <td>{r.collection_date ? new Date(r.collection_date).toLocaleDateString() : ""}</td>
                    <td>{r.overall_verification}</td>
                    <td>
                      {r.pdfPath ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDownloadMedicalReport(r.pdfPath)}
                        >
                          <i className="bi bi-file-pdf" />
                        </button>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openModal(r)}
                      >
                        <i className="bi bi-eye" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No medical reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <MedicalReviewModal
        reviewData={selectedReview}
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

    </div>
  );
};

// Reusable small info display box
const InfoBox = ({ label, value, handleDownloadLicense }) => (
  <Col className="mb-3" >
    <div className="fw-normal text-muted fs-6">{label}</div>
    {label == "view" ? (
      <Button variant="outline-primary" size="sm" onClick={() => handleDownloadLicense(value)} >
        <i className="bi bi-download" /> Download
      </Button>
    ) : (
      <div className="fw-semibold fs-6">{value || "-"}</div>
    )}
  </Col>
);

export default DriverDetails;
