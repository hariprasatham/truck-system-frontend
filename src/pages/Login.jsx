import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import useUserStore from '../store/userStore';
import backgroundImage from '../assets/img/4.png';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const { login, loading, error } = useUserStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    console.log(username, password)
    try {
      await login({ username, password });
      // Redirect on success
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled by the store
    }
      
    
  };

  return (
    <div className="login-body-container" style={{ 
  background: `url(${backgroundImage}) no-repeat center center / cover` 
}}>

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