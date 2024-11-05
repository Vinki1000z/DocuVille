import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when request starts

    try {
      const response = await axios.post('https://docu-ville-backend.vercel.app/api/signup', {
        name,
        email,
        password
      });

      // Store the token and expiration time in sessionStorage
      const token = response.data.token;
      const expirationTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiration', expirationTime);

      // Call onLogin to update the authentication state
      onLogin(token);

      // Display success toast
      toast.success('Sign up successful! Welcome!');

      console.log('Sign Up Success:', response.data);
      // Handle additional actions (e.g., redirect) here if needed

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Sign up failed. Please try again.';
      // Display error toast
      toast.error(errorMsg);

      console.error('Sign Up Error:', error);

    } finally {
      setLoading(false); // Set loading state to false once the request is complete
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <div className="mb-3">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>
      
      <p className="forgot-password text-right">
        Already registered <a href="/sign-in">sign in?</a>
      </p>
    </form>
  );
};

export default SignUp;
