// src/components/ErrorBoundary.jsx
import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    // You can also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but an unexpected error occurred.</p>
            <details style={{ whiteSpace: 'pre-wrap', margin: '20px 0' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
            <div className="error-actions">
              <button 
                className="btn btn-primary me-2" 
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add some basic styling
const errorBoundaryStyles = `
  .error-boundary {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: sans-serif;
  }
  .error-boundary-content {
    background: #fff8f8;
    border-left: 4px solid #ff3333;
    padding: 20px;
    border-radius: 4px;
  }
  .error-actions {
    margin-top: 20px;
  }
`;

// Add styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = errorBoundaryStyles;
document.head.appendChild(styleElement);

export default ErrorBoundary;