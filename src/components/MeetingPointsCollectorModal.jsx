import { Form, Modal, Button } from "react-bootstrap";

const MeetingPointsCollectorModal = ({ 
    showMeetingModal, 
    setShowMeetingModal,
    onSaveMeeting,
    meetingForm,
    SetMeetingForm
}) => {
    return (
        <Modal show={showMeetingModal} onHide={() => setShowMeetingModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Record Meeting with Driver</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Meeting Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={meetingForm.date}
                            onChange={(e) => SetMeetingForm({...meetingForm, date: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Meeting Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={meetingForm.meetingNotes}
                            onChange={(e) => SetMeetingForm({...meetingForm, meetingNotes: e.target.value})}
                            placeholder="Enter meeting notes and discussion points"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowMeetingModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSaveMeeting}>
                    Save Meeting Details
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MeetingPointsCollectorModal;