import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { HttpService } from '../../services/HttpService';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validate form
        if (formData.password !== formData.confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            setLoading(false);
            return;
        }

        try {
            // Prepare data for API
            const userData = {
                ime: formData.ime,
                prezime: formData.prezime,
                email: formData.email,
                lozinka: formData.password
            };

            // Send registration request
            await HttpService.post('/Autentifikacija/Register', userData);
            
            setSuccess('Registracija uspješna! Možete se prijaviti.');
            
            // Clear form
            setFormData({
                ime: '',
                prezime: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Došlo je do greške prilikom registracije. Pokušajte ponovno.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={6} lg={5} className="login-form-container">
                    <h2 className="text-center mb-4">Registracija</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                value={formData.ime}
                                onChange={handleChange}
                                placeholder="Unesite vaše ime"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                value={formData.prezime}
                                onChange={handleChange}
                                placeholder="Unesite vaše prezime"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Unesite vaš email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Unesite lozinku"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Potvrdite lozinku</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Potvrdite lozinku"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Registracija u tijeku...' : 'Registriraj se'}
                            </Button>
                        </div>
                        
                        <div className="text-center mt-3">
                            <p>
                                Već imate račun?{' '}
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}>
                                    Prijavite se
                                </a>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
