// PrivateRoute.js
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Route {...rest} element={<Component />} />
  ) : (
    <Navigate to="/auth" />
  );
};

export default PrivateRoute;
