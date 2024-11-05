import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import DocumentUpload from "./components/DocumentUpload";
import AdminDashboard from "./components/AdminDashboard"; // Import the AdminDashboard component
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Initialize userRole to null

  // Check for token on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);

      // Fetch user role
      axios.get("https://docu-ville-backend.vercel.app/api/users/role", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
   
        setUserRole(response.data.isAdmin); // Set user role as "admin" or "user"
      })
      .catch(error => {
        console.error("Error fetching user role:", error.response?.data || error.message);
        setIsAuthenticated(false); // If there's an error, set authenticated to false
      });
    } else {
      setIsAuthenticated(false); // No token found, set authenticated to false
    }
  }, []);

  const handleLogin = (token) => {
    sessionStorage.setItem("token", token); 
    setIsAuthenticated(true);
    // Fetch the user role again upon login
    axios.get("https://docu-ville-backend.vercel.app/api/users/role", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setUserRole(response.data.isAdmin);
    })
    .catch(error => {
      console.error("Error fetching user role:", error.response?.data || error.message);
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token"); 
    setIsAuthenticated(false);
    setUserRole(null); // Reset user role on logout
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/sign-in"}>
              Docs
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                {isAuthenticated ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-in"}>
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={"/sign-up"}>
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    userRole === true ? (
                      <AdminDashboard onLogout={handleLogout} /> // Show AdminDashboard for admin
                    ) : (
                      <DocumentUpload onLogout={handleLogout} /> // Show DocumentUpload for regular user
                    )
                  ) : (
                    <Navigate to="/sign-in" />
                  )
                }
              />
              <Route path="/sign-in" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
              <Route path="/sign-up" element={!isAuthenticated ? <SignUp onLogin={handleLogin} /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
    </Router>
  );
}

export default App;
