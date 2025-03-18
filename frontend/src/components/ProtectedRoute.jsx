import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { RouteNames } from '../constants';

/**
 * A wrapper component for routes that require authentication
 * If the user is not logged in, they will be redirected to the login page
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - The child component to render if authenticated
 * @param {Array<string>} [props.requiredRoles] - Optional array of roles required to access this route
 * @returns {JSX.Element} The protected component or a redirect
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const userInfo = AuthService.getUserInfo();
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to={RouteNames.LOGIN} replace />;
  }
  
  // If roles are required, check if user has the required role
  if (requiredRoles.length > 0) {
    const userRoles = userInfo?.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to home
      return <Navigate to={RouteNames.HOME} replace />;
    }
  }
  
  // User is authenticated and has the required role (if any), render the protected component
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;
