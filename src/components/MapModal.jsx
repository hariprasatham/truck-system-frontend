import { Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapModal = ({ showMapModal, setShowMapModal, location }) => {
    return (
        <Modal
            show={showMapModal}
            onHide={() => setShowMapModal(false)}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Incident Location</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '60vh' }}>
                {location && (
                    <MapContainer
                        center={[location?.latitude, location?.longitude]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location?.latitude, location?.longitude]}>
                            <Popup>Incident Location</Popup>
                        </Marker>
                    </MapContainer>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowMapModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default MapModal