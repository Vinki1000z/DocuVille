import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ onLogin }) => { // Accept onLogin as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://docu-ville-backend.vercel.app/api/login', { email, password });
      
      // Success toast
      toast.success('Login successful!');
      
      // Store the token and expiration time in sessionStorage
      const token = response.data.token;
      const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiration', expirationTime);

      // Call the onLogin function to update the authentication state
      onLogin(token);

      console.log('Login successful:', response.data);
      // You can redirect or handle other post-login actions here

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      
      // Error toast
      toast.error(errorMsg);
      
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign In</h3>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Login;
