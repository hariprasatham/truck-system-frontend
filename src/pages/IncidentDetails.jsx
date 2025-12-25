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
import MeetingPointsCollectorModal from "../components/MeetingPointsCollectorModal";
import MapModal from "../components/MapModal";

const IncidentDetails = () => {
  const { incidentId = "" } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const {
    getIncidentById,
    getImage,
    StatusAndSignature,
    loading,
    addMeetingNotes,
    getMeetingNotes,
    meetingNotes,
    getWitnessAudio,
    downloadReport,
    downloadAllReports,
    sendFirstSafetyWarning,
    sendSecondSafetyWarning,
    sendFinalSafetyWarning,
    sendTerminationLetter,
  } = useIncidentManagementStore();

  const [mediaData, setMediaData] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const [audioData, setAudioData] = useState({});
  const [audioLoadingStates, setAudioLoadingStates] = useState({});

  const [selectedImage, setSelectedImage] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [meetingForm, SetMeetingForm] = useState({
    meetingNotes: "",
    date: ""
  })

  const [statusFormErrors, setStatusFormErrors] = useState(null)

  const [showMapModal, setShowMapModal] = useState(false);


  const [statusForm, setStatusForm] = useState({
    status: '',
    corrective_actions: '',
    emailType: '',
  });

  const fetchIncident = async () => {
    try {
      const data = await getIncidentById(incidentId);
      const meetingNotesData = await getMeetingNotes(incidentId)
      setIncident(data);
      SetMeetingForm({
        meetingNotes: meetingNotesData?.meeting_notes,
        date: meetingNotesData?.date
      })
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

  useEffect(() => {
    if (!incident?.witness_evidence?.length) return;

    let isMounted = true;
    const newAudioData = {};
    const newLoadingStates = {};

    const loadAudio = async () => {
      for (const audio of incident.witness_evidence) {
        if (!audio.file_url || audioData[audio.file_url]) continue;

        newLoadingStates[audio.file_url] = true;
        try {
          const audioBlob = await getWitnessAudio(audio.file_url);
          if (audioBlob && isMounted) {
            const url = URL.createObjectURL(audioBlob.blob);
            newAudioData[audio.file_url] = {
              url,
              type: audioBlob.type,
              blob: audioBlob.blob
            };
          }
        } catch (error) {
          console.error('Error loading audio:', error);
        } finally {
          if (isMounted) {
            delete newLoadingStates[audio.file_url];
          }
        }
      }

      if (isMounted) {
        setAudioData(prev => ({ ...prev, ...newAudioData }));
        setAudioLoadingStates(prev => ({ ...prev, ...newLoadingStates }));
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      // Clean up object URLs to prevent memory leaks
      Object.values(audioData).forEach(audio => {
        if (audio?.url) {
          URL.revokeObjectURL(audio.url);
        }
      });
    };
  }, [incident?.witness_evidence, getWitnessAudio]);


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

  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!statusForm.status) {
      errors.status = "Status is required";
    }
    if (!statusForm.corrective_actions?.trim()) {
      errors.corrective_actions = "Corrective actions are required";
    }

    console.log(statusForm, "statusForm")

    if (statusForm?.status == "warning" && (!statusForm.emailType || !statusForm.emailType?.trim())) {
      errors.emailType = "Warning type is required for warning status";
      return errors
    }

    if (statusForm?.status == "warning") {
      switch (statusForm.emailType) {
        case 'firstSafetyWarning':
        case 'secondSafetyWarning':
        case 'finalSafetyWarning':
          if (!statusForm.incidentDate) {
            errors.incidentDate = "Incident date is required";
          }
          if (!statusForm.violationDetails?.trim()) {
            errors.violationDetails = "Violation details are required";
          }
          break;
        case 'terminationNotice':
          if (!statusForm.effectiveDate) {
            errors.effectiveDate = "Effective date is required";
          }
          if (!statusForm.violationDetails?.trim()) {
            errors.violationDetails = "Violation details are required";
          }
          if (!statusForm.returnDeadline?.trim()) {
            errors.returnDeadline = "Return deadline is required";
          }
          if (!statusForm.hrContact?.trim()) {
            errors.hrContact = "HR contact is required";
          }
          break;
        default:
          if (!statusForm.emailType) {
            errors.emailType = "Email type is required when status is warning";
          }
          break;
      }
    }


    return errors;
  };

  const handleStatusUpdate = async () => {
    const errors = validateForm();

    console.log("errors", errors)

    if (Object.keys(errors).length > 0) {
      setStatusFormErrors(errors);
      return;
    }


    try {
      setMediaData({});
      setLoadingStates({});
      const res = await StatusAndSignature(incidentId, {
        status: statusForm.status,
        corrective_actions: statusForm.corrective_actions
      });

      if (statusForm.status === 'warning' && statusForm.emailType) {
        let emailData;


        switch (statusForm.emailType) {
          case 'firstSafetyWarning':
            emailData = {
              emailType: 'firstSafetyWarning',
              email: incident?.driver?.email,
              date: moment().format('MM/DD/YYYY'),
              driverName: `${incident?.driver?.first_name} ${incident?.driver?.last_name}`,
              driverLicenseNumber: incident?.driver?.licenses[0]?.license_number,
              unitNumber: incident?.truck?.truck_no || 'N/A',
              companyName: incident?.company?.company_name || 'N/A',
              authorizedPerson: incident?.supervisor?.username || 'N/A',
              designation: incident?.supervisor?.role || 'N/A',
              incidentDate: statusForm.incidentDate,
              violationDetails: statusForm.violationDetails,
              correctiveAction: statusForm.corrective_actions

            };
            await sendFirstSafetyWarning(emailData);
            break;
          case 'secondSafetyWarning':
            emailData = {
              emailType: 'secondSafetyWarning',
              email: incident?.driver?.email,
              date: moment().format('MM/DD/YYYY'),
              driverName: `${incident?.driver?.first_name} ${incident?.driver?.last_name}`,
              driverLicenseNumber: incident?.driver?.licenses[0]?.license_number,
              unitNumber: incident?.truck?.truck_no || 'N/A',
              companyName: incident?.company?.company_name || 'N/A',
              authorizedPerson: incident?.supervisor?.username || 'N/A',
              designation: incident?.supervisor?.role || 'N/A',
              incidentDate: statusForm.incidentDate,
              violationDetails: statusForm.violationDetails,
              correctiveActions: statusForm.corrective_actions
            };
            await sendSecondSafetyWarning(emailData);
            break;
          case 'finalSafetyWarning':
            emailData = {
              emailType: 'finalSafetyWarning',
              email: incident?.driver?.email,
              date: moment().format('MM/DD/YYYY'),
              driverName: `${incident?.driver?.first_name} ${incident?.driver?.last_name}`,
              driverLicenseNumber: incident?.driver?.licenses[0]?.license_number,
              unitNumber: incident?.truck?.truck_no || 'N/A',
              companyName: incident?.company?.company_name || 'N/A',
              authorizedPerson: incident?.supervisor?.username || 'N/A',
              designation: incident?.supervisor?.role || 'N/A',
              incidentDate: statusForm.incidentDate,
              violationDetails: statusForm.violationDetails,
              correctiveActions: statusForm.corrective_actions
            };
            await sendFinalSafetyWarning(emailData);
            break;
          case 'terminationNotice':
            emailData = {
              emailType: 'terminationNotice',
              email: incident?.driver?.email,
              date: moment().format('MM/DD/YYYY'),
              driverName: `${incident?.driver?.first_name} ${incident?.driver?.last_name}`,
              driverLicenseNumber: incident?.driver?.licenses[0]?.license_number,
              unitNumber: incident?.truck?.truck_no || 'N/A',
              companyName: incident?.company?.company_name || 'N/A',
              authorizedPerson: incident?.supervisor?.username || 'N/A',
              designation: incident?.supervisor?.role || 'N/A',
              effectiveDate:  statusForm?.effectiveDate ? formatDate(new Date(statusForm.effectiveDate)) : formatDate(new Date()),
              violationDetails: statusForm?.violationDetails,
              returnDeadline: statusForm?.returnDeadline ? formatDate(new Date(statusForm.returnDeadline)) : formatDate(new Date()),
              hrContact: statusForm?.hrContact || '',
            };
            await sendTerminationLetter(emailData);
            break;
          default:
            break;
        }
      }


      fetchIncident();

      setShowStatusModal(false);
      toast.success('Incident status updated successfully');
    } catch (error) {
      console.error('Error updating incident status:', error);
      toast.error(error?.response?.data?.message?.error || 'Failed to update incident status');
    }finally{
      setStatusFormErrors(null)
    }
  };

  const isValidBase64 = (str) => {
    if (typeof str !== 'string') return false;
    try {
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(str)) return false;
      // Try to decode and re-encode to verify
      const decoded = atob(str);
      const reEncoded = btoa(decoded);
      return reEncoded === str;
    } catch (e) {
      return false;
    }
  };

  const handleOpenStatusModal = () => {
    setStatusForm({
      status: incident.status || '',
      corrective_actions: incident.corrective_actions || ''
    });
    setShowStatusModal(true);
  };

  const downloadAccidentReportPdf = async () => {
    try {
      const response = await downloadReport(incidentId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `accident-report-${incidentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL object
      toast.success('Accident report downloaded successfully');
    } catch (error) {
      console.error('Error downloading accident report:', error);
      toast.error(error.response?.data?.message || 'Failed to download accident report');
    }
  };

  const handleDownloadAll = async () => {
    try {
      const blob = await downloadAllReports(incidentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `incident-${incidentId}-evidence.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('All evidence downloaded successfully');
    } catch (error) {
      console.error('Error downloading evidence:', error);
      toast.error(error.response?.data?.message || 'Failed to download evidence');
    }
  };


  const location = incident?.location || null;
  const otherVehicles = incident?.other_vehicles || [];
  const witnesses = incident?.witnesses || [];

  const renderStatusBadge = (status) => {
    const statusConfig = {
      submitted: { variant: "primary", text: "Submitted" },
      under_review: { variant: "warning", text: "Under Review" },
      approved: { variant: "success", text: "Approved" },
      rejected: { variant: "danger", text: "Rejected" },
      warning: { variant: "warning", text: "Warning" },
      refer_to_higher_management: { variant: "info", text: "Refer To Higher Management" },
      refer_to_training: { variant: "info", text: "Refer To Training" },
      insurance_claim_initiated: { variant: "success", text: "Insurance Claim Initiated" },
      need_to_intiate_insurance_claim: { variant: "warning", text: "Need to Initiate Insurance Claim" },
      closed: { variant: "secondary", text: "Closed" }
    };
    const config = statusConfig[status] || { variant: "secondary", text: status };
    return <Badge bg={config?.variant} className="text-capitalize">{config?.text?.replace(/_/g, ' ')}</Badge>;
  };

  const handleSaveMeeting = async () => {
    try {
      await addMeetingNotes(incidentId, meetingForm);
      // You might want to add a success message or refresh the incident data here
      setShowMeetingModal(false);
      toast.success('Meeting notes saved successfully');
    } catch (error) {
      console.error('Failed to save meeting notes:', error);
      // Handle the error (e.g., show an error message to the user)
      toast.error('Failed to save meeting notes');
    }

    // 1. meeting point1
    // 2. meeting point2
    // 3. meeting point3
  }

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
          <Button variant="primary" className="me-2" onClick={() => downloadAccidentReportPdf()}>
            <i className="bi bi-printer" /> Print Report
          </Button>
          <Button variant="primary" onClick={() => handleDownloadAll()}>
            <i className="bi bi-download" /> Download All Evidence
          </Button>
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
              value={
                location ? (
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={handleOpenMap}
                  >
                    {`${location?.latitude || ''}, ${location?.longitude || ''} (View Map)`}
                  </Button>
                ) : (
                  "N/A"
                )
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
                <th >Vehicle Damage</th>
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
                    <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                      {vehicle?.vehicle_damage || "N/A"}
                    </td>
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
            label="Officer Number"
            value={incident?.officer_number || "N/A"}
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

      {
        renderSection("10. Witness Audio Evidence", (
          <div className="w-100">
            {incident?.witness_evidence && incident?.witness_evidence?.length > 0 ? (
              <Row>
                {incident?.witness_evidence?.map((audio, index) => (
                  <Col key={index} md={6} className="mb-3">
                    <Card>
                      {audioLoadingStates[audio?.file_url] ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: '80px', backgroundColor: '#f8f9fa' }}
                        >
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : audioData[audio?.file_url]?.type?.startsWith('audio/') ? (
                        <div className="p-3">
                          <audio
                            controls
                            controlsList="nodownload"
                            style={{ width: '100%' }}
                          >
                            <source
                              src={audioData[audio?.file_url]?.url}
                              type={audioData[audio?.file_url]?.type}
                            />
                            Your browser does not support the audio element.
                          </audio>
                          <div className="text-muted small mt-2">
                            {audio.file_name || `Audio ${index + 1}`}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-3">
                          <i className="bi bi-file-earmark-music fs-1 text-muted"></i>
                          <div>Unsupported audio format</div>
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-muted text-center py-3">No audio evidence available</div>
            )}
          </div>
        ))
      }

      {/* 11. Supervisor / Safety Officer Review */}
      {renderSection("11. Supervisor / Safety Officer Review", (
        <Row>
          <InfoBox
            label="Supervisor Name"
            value={incident?.supervisor?.username || "N/A"}
          />

          <InfoBox
            label="Driver Signature"
            value={incident?.driver_signature ? (
              isValidBase64(incident.driver_signature) ? (
                <img
                  src={`data:image/png;base64,${incident.driver_signature}`}
                  alt="Driver Signature"
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                />
              ) : (
                <span className="text-warning">Invalid signature format</span>
              )
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

      {renderSection("12. Meeting With Driver", (
        <Row>
          <InfoBox
            label="Meeting Date"
            value={meetingNotes?.date ? formatDate(meetingNotes?.date) : "Not scheduled"}
          />
          <InfoBox
            label="Supervisor Name"
            value={incident?.supervisor?.username || "N/A"}
          />
          <InfoBox
            label="Meeting Notes"
            value={meetingNotes?.meeting_notes || "No notes available"}
          />
          <Col md={12} className="mt-3">
            <Button
              variant="primary"
              onClick={() => setShowMeetingModal(true)}
              disabled={incident?.status === 'closed'}
            >
              <i className="bi bi-plus-circle me-2" />
              {incident?.meeting_date ? "Update Meeting Points" : "Add Meeting Points"}
            </Button>
          </Col>
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
      <Modal show={showStatusModal} onHide={() => {
        setShowStatusModal(false)
        setStatusFormErrors(null)
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Update Incident Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value, emailType: "" })}
                disabled={loading}
                
                isInvalid={!!statusFormErrors?.status}
                className={statusFormErrors?.status ? "is-invalid" : ""}
              >
                <option value="">Select Status</option>

                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="warning">Warning</option>
                <option value="refer_to_higher_management">Refer To Higher Management</option>
                <option value="refer_to_training">Refer To Training</option>
                <option value="insurance_claim_initiated">Insurance Claim Initiated</option>
                <option value="need_to_intiate_insurance_claim">Need to Intiate Insurance Claim</option>
                <option value="closed">Closed</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.status}
                    </Form.Control.Feedback>
            </Form.Group>
            {
              statusForm.status === 'warning' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Type</Form.Label>
                    <Form.Select
                      value={statusForm?.emailType || ""}
                      onChange={(e) => setStatusForm({ ...statusForm, emailType: e.target.value })}
                      disabled={loading}
                      isInvalid={!!statusFormErrors?.emailType}
                      className={statusFormErrors?.emailType ? "is-invalid" : ""}
                    >
                      <option value="">Select Warning Status</option>

                      <option value="firstSafetyWarning">First Safety Warning</option>
                      <option value="secondSafetyWarning">Second Safety Warning</option>
                      <option value="finalSafetyWarning">Final Safety Warning</option>
                      <option value="terminationNotice">Termination Notice</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.emailType}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )
            }{
              statusForm.emailType == "terminationNotice" ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Effective Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={statusForm.effectiveDate || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, effectiveDate: e.target.value })}
                      disabled={loading}
                      required
                      isInvalid={!!statusFormErrors?.effectiveDate}
                      className={statusFormErrors?.effectiveDate ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.effectiveDate}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Violation Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={statusForm.violationDetails || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, violationDetails: e.target.value })}
                      disabled={loading}
                      placeholder="Enter details of the violations..."
                      required
                      isInvalid={!!statusFormErrors?.violationDetails}
                      className={statusFormErrors?.violationDetails ? "is-invalid" : ""}
                    />
                    
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.violationDetails}
                    </Form.Control.Feedback>
                    </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Return Deadline</Form.Label>
                    <Form.Control
                      type="text"
                      value={statusForm.returnDeadline || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, returnDeadline: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., Company property, uniform, ID card, etc."
                      required
                      isInvalid={!!statusFormErrors?.returnDeadline}
                      className={statusFormErrors?.returnDeadline ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.returnDeadline}
                    </Form.Control.Feedback>
                  </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hr contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={statusForm.hrContact || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, hrContact: e.target.value })}
                      disabled={loading}
                      placeholder="Enter HR contact information..."
                      required
                      isInvalid={!!statusFormErrors?.hrContact}
                      className={statusFormErrors?.hrContact ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.hrContact}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                </>
              ) : (statusForm.emailType === "firstSafetyWarning" ||
                statusForm.emailType === "secondSafetyWarning" ||
                statusForm.emailType === "finalSafetyWarning") ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Incident Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={statusForm.incidentDate || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, incidentDate: e.target.value })}
                      disabled={loading}
                      required
                      isInvalid={!!statusFormErrors?.incidentDate}
                      className={statusFormErrors?.incidentDate ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.incidentDate}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Violation Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={statusForm.violationDetails || ''}
                      onChange={(e) => setStatusForm({ ...statusForm, violationDetails: e.target.value })}
                      disabled={loading}
                      placeholder="Enter details of the violations..."
                      required
                      isInvalid={!!statusFormErrors?.violationDetails}
                      className={statusFormErrors?.violationDetails ? "is-invalid" : ""}
                    />
                    <Form.Control.Feedback type="invalid">
                      {statusFormErrors?.violationDetails}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              ) : null
            }
            <Form.Group className="mb-3">
              <Form.Label>Corrective Actions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={statusForm.corrective_actions}
                onChange={(e) => setStatusForm({ ...statusForm, corrective_actions: e.target.value })}
                disabled={loading}
                placeholder="Enter corrective actions taken..."
                isInvalid={!!statusFormErrors?.corrective_actions}
                className={statusFormErrors?.corrective_actions ? "is-invalid" : ""}
              />
              <Form.Control.Feedback type="invalid">
                {statusFormErrors?.corrective_actions}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowStatusModal(false)
            setStatusFormErrors(null)
            }} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleStatusUpdate}
            disabled={loading || !statusForm?.status}
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

      <MeetingPointsCollectorModal
        showMeetingModal={showMeetingModal}
        setShowMeetingModal={setShowMeetingModal}
        onSaveMeeting={handleSaveMeeting}
        meetingForm={meetingForm}
        SetMeetingForm={SetMeetingForm}
      />

      <MapModal
        showMapModal={showMapModal}
        setShowMapModal={setShowMapModal}
        location={location}
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
