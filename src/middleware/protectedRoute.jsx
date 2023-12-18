import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkIfUserIsAuthenticated();

  function checkIfUserIsAuthenticated() {
    // Retrieve the token from localStorage
    const token = getStoredToken();
    // Check if the token is valid or exists
    return !!token;
  }

  function getStoredToken() {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    return token;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" />
  );
};

export default ProtectedRoute;
