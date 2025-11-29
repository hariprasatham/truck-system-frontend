import { Button, Modal } from "react-bootstrap";

const ViewImageModal = ({ selectedImage, setSelectedImage }) => {
    if (!selectedImage) return null;

    const isVideo = selectedImage?.type?.startsWith('video/');
    const fileExtension = selectedImage?.url?.split('.').pop()?.toLowerCase();

    return (
        <Modal
            show={!!selectedImage}
            onHide={() => setSelectedImage(null)}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>View {isVideo ? 'Video' : 'Image'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <div style={{ maxWidth: '100%', maxHeight: '70vh', overflow: 'hidden' }}>
                    {isVideo ? (
                        <video 
                            controls 
                            autoPlay 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '70vh',
                                backgroundColor: '#000'
                            }}
                        >
                            <source 
                                src={selectedImage.url} 
                                type={isVideo ? selectedImage.type : `video/${fileExtension}`} 
                            />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={selectedImage.url}
                            alt="Full size"
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => window.open(selectedImage.url, '_blank')}
                >
                    <i className="bi bi-box-arrow-up-right me-1" /> Open in New Tab
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={() => setSelectedImage(null)}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewImageModal;