import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // For manual token handling (if you already have the token)
            if (import.meta.env.DEV && email === 'demo' && password === 'demo') {
                // This is just for testing - replace with your actual token
                const manualToken = prompt('Enter your JWT token:');
                if (manualToken) {
                    AuthService.setToken(manualToken);
                    navigate('/');
                    return;
                }
            }

            // Normal login flow
            await AuthService.login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={6} lg={5} className="login-form-container">
                    <h2 className="text-center mb-4">Login</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                        
                        <div className="text-center mt-3">
                            <p>
                                Nemate račun?{' '}
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}>
                                    Registrirajte se
                                </a>
                            </p>
                            <p>
                                Zaboravili ste lozinku?{' '}
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/reset-password');
                                }}>
                                    Resetirajte lozinku
                                </a>
                            </p>
                            <p>
                                Already have a token?{' '}
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/manual-token');
                                }}>
                                    Use token directly
                                </a>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
