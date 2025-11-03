import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container className="h-100">
        <Row className="h-100 align-items-center justify-content-center text-center">
          <Col xs={12} md={8} lg={6} className="py-5">
            <div className="error-code">404</div>
            <h1 className="mb-4">Page Not Found</h1>
            <p className="lead mb-4">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              className="mt-3"
            >
              <i className="bi bi-house-door me-2"></i>Back to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;