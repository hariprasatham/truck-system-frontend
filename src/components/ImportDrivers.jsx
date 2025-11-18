import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DriverSample from "../assets/DriversSample.xlsx"
import useCompanyDriverStore from '../store/companyDriverStore';

const ImportDrivers = ({ showImportModal, setShowImportModal, onSubmit, onChange, loading }) => {
    const { importDriverError, clearImportDriverError } = useCompanyDriverStore();
    return (
        <div>
            <Modal
                show={showImportModal}
                onHide={() => {
                    setShowImportModal(false);
                    clearImportDriverError();
                }}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Import Drivers
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {importDriverError?.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className='mb-0'>
                                {importDriverError.map((error, index) => (
                                    <li key={index}>{error.error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="file">
                            <Form.Label>Select Excel/CSV File</Form.Label>
                            <Form.Control type="file" onChange={onChange} />
                        </Form.Group>
                        <div className='d-flex justify-content-end mt-2'>
                            <Button variant="secondary" onClick={() => window.location.href = DriverSample} className='me-2'>
                                <i className="bi bi-download"></i> Download Template
                            </Button>
                            <button className='btn add-driver-btn-primary' type="submit" disabled={loading}>
                                <i className="bi bi-upload"></i>{loading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default ImportDrivers;
