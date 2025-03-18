import { useEffect, useState } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import AuthService from '../services/AuthService';

/**
 * A component to test and display admin role information
 */
const AdminRoleTest = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({});

  useEffect(() => {
    // Get user info from JWT token
    const info = AuthService.getUserInfo();
    setUserInfo(info);
    
    // Check if user has Admin role
    const adminCheck = AuthService.hasRole('Admin');
    setIsAdmin(adminCheck);
    
    // Extract role-related claims from token
    const roleDetails = {};
    
    if (info) {
      // Check standard role formats
      if (info.role) roleDetails.role = info.role;
      if (info.roles) roleDetails.roles = info.roles;
      
      // Check MS format
      const msRoleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      if (info[msRoleClaim]) roleDetails.msRole = info[msRoleClaim];
      
      // Include all claims for inspection
      roleDetails.allClaims = Object.keys(info);
    }
    
    setTokenDetails(roleDetails);
  }, []);

  if (!userInfo) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          No user is logged in or token could not be parsed.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Admin Role Test</h2>
      
      <Card className="mb-4">
        <Card.Header>User Information</Card.Header>
        <Card.Body>
          <p><strong>Username:</strong> {userInfo.name || userInfo.sub || 'Not available'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Header>Token Role Details</Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(tokenDetails, null, 2)}</pre>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header>Full Token Payload</Card.Header>
        <Card.Body>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminRoleTest;
