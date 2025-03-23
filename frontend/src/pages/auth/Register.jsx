import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import AuthService from '../../services/AuthService';
import { profilePictures, setUserProfilePicture } from '../../utils/imageUtils';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(profilePictures[0]);
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
                Ime: formData.ime,
                Prezime: formData.prezime,
                Nickname: formData.nickname,
                KorisnickoIme: formData.email,
                Lozinka: formData.password
            };

            // Send registration request
            const response = await AuthService.register(userData);
            
            // Save the selected profile picture and nickname
            if (response && response.id) {
                setUserProfilePicture(response.id, selectedProfilePicture);
                
                // Store nickname in localStorage for easy access
                localStorage.setItem(`user_nickname_${response.id}`, formData.nickname);
            }
            
            setSuccess('Registracija uspješna! Možete se prijaviti.');
            
            // Clear form
            setFormData({
                ime: '',
                prezime: '',
                nickname: '',
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
                            <Form.Label>Nadimak (Nickname)</Form.Label>
                            <Form.Control
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="Unesite vaš nadimak koji će biti javno vidljiv"
                                required
                            />
                            <Form.Text className="text-muted">
                                Ovaj nadimak će biti prikazan pored vaše profilne slike.
                            </Form.Text>
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

                        <Form.Group className="mb-4">
                            <Form.Label>Odaberite profilnu sliku</Form.Label>
                            <div className="d-flex flex-wrap justify-content-center">
                                {profilePictures.map((picture, index) => (
                                    <div 
                                        key={index} 
                                        className="m-2" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedProfilePicture(picture)}
                                    >
                                        <Image 
                                            src={picture} 
                                            roundedCircle 
                                            width={60} 
                                            height={60} 
                                            className={selectedProfilePicture === picture ? 'border border-primary border-3' : ''}
                                        />
                                    </div>
                                ))}
                            </div>
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
