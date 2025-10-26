import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/login', { // Adapt your PHP login.php to this API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/dashboard'); // Redirect to dashboard on success
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-body-container">

<div className="container-fluid">
  <div className="app-features">
    <h1>Fleet Management Simplified</h1>
    <div className="feature-item">Manage Drivers & Routes</div>
    <div className="feature-item">Fuel & Maintenance Logs</div>
    <div className="feature-item">Automated Reports & Alerts</div>
  </div>


  <div className="login-card">
    <div className="login-header">
      <h2>🚛 Truck Management</h2>
      <p>Securely login to manage your fleet</p>
    </div>

    {error && <div className="alert alert-danger">{error}</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          name="username"
          className="form-control"
          placeholder="Enter Username"
          required
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter Password"
          required
          onChange={handleChange}
        />
      </div>
      <button type="submit" name="login" className="btn btn-login w-100">Login</button>
    </form>

    <div className="extra-links">
      <a href="#">Forgot Password?</a>
    </div>
  </div>
</div>

</div>
  );
};

export default Login;