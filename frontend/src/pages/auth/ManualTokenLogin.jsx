import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { setManualToken, isTokenValid } from '../../utils/tokenUtils';
import './Login.css';

const ManualTokenLogin = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token.trim()) {
            setError('Please enter a token');
            return;
        }

        // Validate token format (basic check)
        if (!token.includes('.') || token.split('.').length !== 3) {
            setError('Invalid token format. JWT tokens should have three parts separated by dots.');
            return;
        }

        // Check if token is valid
        if (!isTokenValid(token)) {
            setError('Token is expired or invalid');
            return;
        }

        // Set the token
        const userInfo = setManualToken(token);
        
        if (userInfo) {
            setSuccess(`Successfully logged in as ${userInfo.unique_name || 'user'}`);
            
            // Navigate to home page after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setError('Failed to process the token');
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={8} lg={6} className="login-form-container">
                    <h2 className="text-center mb-4">Manual Token Login</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>JWT Token</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste your JWT token here"
                                required
                            />
                            <Form.Text className="text-muted">
                                Enter the JWT token you received from the authentication endpoint.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit"
                            >
                                Set Token & Login
                            </Button>
                        </div>
                        
                        <div className="text-center mt-3">
                            <p>
                                Need to login with credentials?{' '}
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}>
                                    Go to login page
                                </a>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ManualTokenLogin;
