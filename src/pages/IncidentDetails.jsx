import React, { useEffect, useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Accordion,
  Image,
  Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useIncidentManagementStore from "../store/incidentManagementStore";
import GlobalLoader from "../components/GlobalLoader";
import { toast } from "react-hot-toast";
import moment from 'moment';
import ViewImageModal from "../components/ViewImageModal";

const IncidentDetails = () => {
  const { incidentId = "" } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const { getIncidentById, getImage, StatusAndSignature, loading } = useIncidentManagementStore();

  const [mediaData, setMediaData] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [statusForm, setStatusForm] = useState({
    status: '',
    corrective_actions: ''
  });

  const fetchIncident = async () => {
    try {
      const data = await getIncidentById(incidentId);
      setIncident(data);
    } catch (error) {
      console.error("Error fetching incident:", error);
      toast.error("Failed to load incident details");
    }
  };


  useEffect(() => {
    fetchIncident();
  }, [incidentId, getIncidentById]);


useEffect(() => {
  if (!incident?.evidence_photos?.length) return;

  let isMounted = true;
  const newMediaData = {};
  const newLoadingStates = {};

  const loadMedia = async () => {
    for (const photo of incident.evidence_photos) {
      if (!photo.file_url || mediaData[photo.file_url]) continue;

      newLoadingStates[photo.file_url] = true;
      try {
        const media = await getImage(photo.file_url);
        if (media && isMounted) {
          const url = URL.createObjectURL(media.blob);
          newMediaData[photo.file_url] = {
            url,
            type: media.type,
            blob: media.blob
          };
        }
      } catch (error) {
        console.error('Error loading media:', error);
      } finally {
        if (isMounted) {
          newLoadingStates[photo.file_url] = false;
        }
      }
    }

    if (isMounted) {
      setMediaData(prev => ({ ...prev, ...newMediaData }));
      setLoadingStates(prev => ({ ...prev, ...newLoadingStates }));
    }
  };

  loadMedia();

  // Cleanup function to revoke object URLs when component unmounts or evidence_photos changes
  return () => {
    isMounted = false;
    // Clean up all object URLs from previous render
    Object.values(mediaData).forEach(media => {
      if (media?.url) {
        URL.revokeObjectURL(media.url);
      }
    });
  };
}, [incident?.evidence_photos, getImage]);


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('MMMM D, YYYY');
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return moment(timeString, 'HH:mm:ss').format('h:mm A'); // Converts 24h to 12h format
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return moment(dateTimeString)?.format('MMMM D, YYYY h:mm A');
  };
  const parseJsonSafely = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;

    try {
       setMediaData({});
    setLoadingStates({});
      await StatusAndSignature(incidentId, {
        status: statusForm.status,
        corrective_actions: statusForm.corrective_actions
      });

      fetchIncident();
      
      setShowStatusModal(false);
      toast.success('Incident status updated successfully');
    } catch (error) {
      console.error('Error updating incident status:', error);
      toast.error('Failed to update incident status');
    }
  };

  const handleOpenStatusModal = () => {
    setStatusForm({
      status: incident.status || '',
      corrective_actions: incident.corrective_actions || ''
    });
    setShowStatusModal(true);
  };

  const location = incident?.location ? parseJsonSafely(incident?.location) : null;
  const otherVehicles = incident?.other_vehicles ? parseJsonSafely(incident?.other_vehicles) : [];
  const witnesses = incident?.witnesses ? parseJsonSafely(incident?.witnesses) : [];

  const renderStatusBadge = (status) => {
    const statusConfig = {
      submitted: { variant: "primary", text: "Submitted" },
      under_review: { variant: "warning", text: "Under Review" },
      approved: { variant: "success", text: "Approved" },
      rejected: { variant: "danger", text: "Rejected" }
    };

    const config = statusConfig[status] || { variant: "secondary", text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const renderSection = (title, children) => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
  return (
    <div className="content ">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Incident Report #{incident?.id}</h3>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left" /> Back to Incidents
          </Button>
          {/* <Button variant="primary" onClick={() => window.print()}>
            <i className="bi bi-printer" /> Print Report
          </Button> */}
        </div>
      </div>

      <div className="mb-3">
        <span className="me-3">
          <strong>Status:</strong> {renderStatusBadge(incident?.status)}
        </span>
        <span className="me-3">
          <strong>Reported On:</strong> {formatDateTime(incident?.date_reported)}
        </span>
      </div>

      {/* 1. Company Information */}
      {renderSection("1. Company Information", (
        <Row>
          <InfoBox label="Company" value={incident?.company?.company_name || "N/A"} />
          <InfoBox label="Driver Name" value={incident?.driver?.first_name + " " + incident?.driver?.last_name || "N/A"} />
          <InfoBox label="Driver DOB" value={incident?.driver?.dob || "N/A"} />
          <InfoBox label="Driver Number" value={incident?.driver?.phone || "N/A"} />
          <InfoBox label="Unit/Truck Number" value={incident?.truck?.truck_no || "N/A"} />
          <InfoBox label="Fleet/Division" value={incident?.fleet?.id ? `${incident?.fleet?.name}` : "N/A"} />
          {/* <InfoBox label="Reported By" value={incident.driver.first_name + " " + incident.driver.last_name || "N/A"} />
          <InfoBox label="Report Date" value={formatDate(incident.date_reported)} /> */}
        </Row>
      ))}

      {/* 2. Accident Details */}
      {renderSection("2. Accident Details", (
        <>
          <Row>
            <InfoBox label="Accident Date" value={formatDate(incident?.accident_date)} />
            <InfoBox label="Accident Time" value={formatTime(incident?.accident_time)} />

            <InfoBox
              label="Location"
              value={location ?
                `${location?.address || ''}, ${location?.city || ''}` :
                "N/A"
              }
            />

            <InfoBox
              label="Province"
              value={incident?.state?.name || "N/A"}
            />
            <InfoBox label="Weather Conditions" value={incident?.weather_conditions || "N/A"} />
            <InfoBox label="Road Conditions" value={incident?.road_conditions || "N/A"} />
            <InfoBox
              label="Area Type"
              value={incident?.area_type || "N/A"}
            />
          </Row>
        </>
      ))}

      {/* 3. Vehicle(s) Involved - Company Vehicle */}
      {renderSection("3. Vehicle(s) Involved - Company Vehicle", (
        <Row>
          <InfoBox label="Year/Make/Model" value={`${incident?.truck?.truck_brand || ''}-${incident?.truck?.model || ''}`.trim() || "N/A"} />
          <InfoBox label="Plate" value={incident?.truck?.plate_no || "N/A"} />
          <InfoBox label="Vin" value={incident?.truck?.vin_number || "N/A"} />
          <InfoBox label="Load Type" value={incident?.load_type || "N/A"} />
          <InfoBox md={12} label="Damage Description" value={incident?.damage_description || "N/A"} />
        </Row>
      ))}

      {/* 4. Other Vehicle(s) Involved */}
      {renderSection("4. Other Vehicle(s) Involved", (
        <div className="table-responsive">
          <Table striped bordered>
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>License Number</th>
                <th>Make/Model/Plate</th>
                <th>Insurance Provider</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {otherVehicles && otherVehicles.length > 0 ? (
                otherVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td>{vehicle?.driver_name || "N/A"}</td>
                    <td>{vehicle?.license_number || "N/A"}</td>
                    <td>{vehicle?.make_model_plate || "N/A"}</td>
                    <td>{vehicle?.insurance_provider || "N/A"}</td>
                    <td>{vehicle?.contact_number || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No other vehicles involved</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ))}

      {/* 5. Description of the Accident */}
      {renderSection("5. Description of the Accident", (
        <div>
          <p>{incident?.accident_description || "No description provided."}</p>
        </div>
      ))}

      {/* 6. Injuries / Medical Attention */}
      {renderSection("6. Injuries / Medical Attention", (
        <Row>
          <InfoBox
            label="Injuries Reported"
            value={incident?.injuries_reported || "None"}
            md={6}
          />
          <InfoBox
            label="First Aid Provided By"
            value={incident?.first_aid_provided_by || "N/A"}
            md={6}
          />
          <InfoBox
            label="Ambulance Information"
            value={incident?.ambulance_info || "N/A"}
            md={6}
          />
          <InfoBox
            label="Hospital Information"
            value={incident?.hospital_info || "N/A"}
            md={6}
          />
        </Row>
      ))}

      {/* 7. Witness Information */}
      {renderSection("7. Witness Information", (
        <div className="table-responsive">
          <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Statement Taken</th>
                <th>Statement</th>
              </tr>
            </thead>
            <tbody>
              {witnesses && witnesses?.length > 0 ? (
                witnesses?.map((witness, index) => (
                  <tr key={index}>
                    <td>{witness?.name || "N/A"}</td>
                    <td>{witness?.contact || "N/A"}</td>
                    <td>{witness?.address || "N/A"}</td>
                    <td>{witness.statement_taken ? "Yes" : "No" || "N/A"}</td>
                    <td>{witness.statement ? witness.statement : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No witnesses</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ))}

      {/* 8. Police / Authority Information */}
      {renderSection("8. Police / Authority Information", (
        <Row>
          <InfoBox
            label="Police Report Filed"
            value={incident?.police_report_filed ? "Yes" : "No"}
          />
          <InfoBox
            label="Officer Name"
            value={incident?.officer_name || "N/A"}
          />
          <InfoBox
            label="Badge Number"
            value={incident?.badge_number || "N/A"}
          />
          <InfoBox
            label="Police Department"
            value={incident?.police_department || "N/A"}
          />
          <InfoBox
            label="Case Number"
            value={incident?.case_number || "N/A"}
            md={6}
          />
        </Row>
      ))}

      {/* 9. Photos / Evidence */}
      {renderSection("9. Photos / Evidence", (
        <div className="w-100" >
          {incident?.evidence_photos && incident?.evidence_photos?.length > 0 ? (
            <Row>
              {incident?.evidence_photos?.map((photo, index) => (
                <Col key={index} md={4} className="mb-3">
                  <Card>
                    {loadingStates[photo?.file_url] ? (
                      <div className="d-flex justify-content-center align-items-center"
                        style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : mediaData[photo?.file_url]?.type?.startsWith('video/') ? (
                      <video
                        controls
                        preload="metadata"
                        style={{
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                          backgroundColor: "#f8f9fa"
                        }}
                        playsInline
                        webkit-playsinline="true"
                        x5-playsinline="true"
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                      >
                        <source
                          src={mediaData[photo?.file_url]?.url}
                          type={mediaData[photo?.file_url]?.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Card.Img
                        variant="top"
                        src={mediaData[photo?.file_url]?.url}
                        style={{
                          height: '200px',
                          objectFit: 'cover'
                        }}
                        alt="Evidence"
                      />
                    )}
                    <Card.Body className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setSelectedImage({
                          file_url: photo?.file_url,
                          type: mediaData[photo?.file_url]?.type
                        })}
                      >
                        <i className={`bi bi-${mediaData[photo?.file_url]?.type?.startsWith('video/') ? 'play-circle' : 'zoom-in'} me-1`} />
                        {mediaData[photo?.file_url]?.type?.startsWith('video/') ? 'Play Video' : 'View Full Size'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No photos or evidence attached.</p>
          )}
        </div>
      ))}

      {/* 10. Supervisor / Safety Officer Review */}
      {renderSection("10. Supervisor / Safety Officer Review", (
        <Row>
          <InfoBox
            label="Supervisor Name"
            value={incident?.supervisor?.username || "N/A"}
          />

          <InfoBox
            label="Driver Signature"
            value={incident?.driver_signature ? (
              <span className="text-success">{incident?.driver_signature}</span>
            ) : (
              <span className="text-danger">Not Signed</span>
            )}
          />
          <InfoBox
            label="Supervisor Signature"
            value={incident?.supervisor_signature ? (
              <span className="text-success">{incident?.supervisor_signature}</span>
            ) : (
              <span className="text-warning">Pending</span>
            )}
          />
          <InfoBox
            label="Signature Date"
            value={incident?.signature_date ? formatDateTime(incident?.signature_date) : "N/A"}
          />
          <InfoBox
            label="Corrective Actions"
            value={incident?.corrective_actions || "N/A"}
            md={12}
          />
        </Row>
      ))}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="primary"
          onClick={handleOpenStatusModal}
          className="me-2"
        >
          <i className="bi bi-pencil" /> Update Status
        </Button>
        {/* <Button variant="outline-secondary" onClick={() => window.print()}>
          <i className="bi bi-printer" /> Print Report
        </Button> */}
      </div>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Incident Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                disabled={loading}
              >
                <option value="">Select Status</option>

                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Corrective Actions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={statusForm.corrective_actions}
                onChange={(e) => setStatusForm({ ...statusForm, corrective_actions: e.target.value })}
                disabled={loading}
                placeholder="Enter corrective actions taken..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStatusUpdate}
            disabled={loading || !statusForm.status}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ViewImageModal
        selectedImage={selectedImage ? {
          url: mediaData[selectedImage.file_url]?.url,
          type: mediaData[selectedImage.file_url]?.type
        } : null}
        setSelectedImage={setSelectedImage}
      />

      <GlobalLoader loading={loading} />
    </div>
  );
};

const InfoBox = ({ label, value, md = 3 }) => (
  <Col md={md} className="mb-3">
    <div className="text-muted small">{label}</div>
    <div className="fw-medium">{value || "N/A"}</div>
  </Col>
);

export default IncidentDetails;