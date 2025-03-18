import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image, Card, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { profilePictures } from '../../utils/imageUtils';
import ImageUploader from '../../components/ImageUploader';
import './Login.css';
import '../../components/ProfileImage.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Define a function to load user data
        const loadUserData = () => {
            // Check if user is logged in
            if (!AuthService.isLoggedIn()) {
                navigate('/login');
                return;
            }

            // Get user info
            const info = AuthService.getUserInfo();
            setUserInfo(info);

            // Get user profile picture
            const profilePicture = AuthService.getUserProfilePicture();
            setSelectedProfilePicture(profilePicture);
        };

        // Call the function
        loadUserData();
    }, [navigate]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProfilePictureChange = (picturePath) => {
        setSelectedProfilePicture(picturePath);
        
        // Save the profile picture
        const success = AuthService.updateUserProfilePicture(picturePath);
        
        if (success) {
            setSuccess('Profilna slika uspješno promijenjena!');
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError('Došlo je do greške prilikom promjene profilne slike.');
            setTimeout(() => setError(''), 3000);
        }
    };
    
    const handleImageUpload = async (base64Image) => {
        try {
            setLoading(true);
            setError('');
            
            // Upload the image
            const result = await AuthService.uploadProfilePicture(base64Image);
            
            if (result.success) {
                // Update the profile picture in the UI
                setSelectedProfilePicture(AuthService.getUserProfilePicture());
                setSuccess('Profilna slika uspješno promijenjena!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error || 'Došlo je do greške prilikom uploada slike');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Došlo je do greške prilikom uploada slike');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Nove lozinke se ne podudaraju.');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Nova lozinka mora imati najmanje 6 znakova.');
            setLoading(false);
            return;
        }

        // Here you would typically call an API to change the password
        // For now, we'll just simulate a successful password change
        setTimeout(() => {
            setSuccess('Lozinka uspješno promijenjena!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setLoading(false);
        }, 1000);
    };

    if (!userInfo) {
        return <div className="text-center p-5">Učitavanje...</div>;
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Header className="bg-primary text-white">
                            <h3 className="mb-0">Moj profil</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <div className="text-center mb-4">
                                <Image 
                                    src={selectedProfilePicture} 
                                    className="profile-image border border-primary"
                                />
                                <h4 className="mt-3">{userInfo.name || userInfo.sub}</h4>
                                <p className="text-muted">
                                    {userInfo.email || userInfo.sub}
                                </p>
                            </div>

                            <Tabs defaultActiveKey="profile" className="mb-4">
                                <Tab eventKey="profile" title="Profilna slika">
                                    <h5 className="mb-3">Odaberite novu profilnu sliku</h5>
                                    
                                    {/* Komponenta za upload vlastite slike */}
                                    <div className="mb-4">
                                        <h6>Upload vlastite slike</h6>
                                        <ImageUploader onImageUpload={handleImageUpload} aspectRatio={1} />
                                    </div>
                                    
                                    <h6>Ili odaberite jednu od predefiniranih slika</h6>
                                    <div className="d-flex flex-wrap justify-content-center">
                                        {profilePictures.map((picture, index) => (
                                            <div 
                                                key={index} 
                                                className="m-2" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleProfilePictureChange(picture)}
                                            >
                                                <Image 
                                                    src={picture} 
                                                    className={`profile-image-sm ${selectedProfilePicture === picture ? 'border border-primary border-3' : ''}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Tab>
                                <Tab eventKey="password" title="Promjena lozinke">
                                    <Form onSubmit={handlePasswordSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Trenutna lozinka</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Unesite trenutnu lozinku"
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Nova lozinka</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Unesite novu lozinku"
                                                required
                                                minLength={6}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Potvrdite novu lozinku</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                placeholder="Potvrdite novu lozinku"
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
                                                {loading ? 'Promjena u tijeku...' : 'Promijeni lozinku'}
                                            </Button>
                                        </div>
                                    </Form>
                                </Tab>
                                <Tab eventKey="account" title="Podaci o računu">
                                    <div className="p-3">
                                        <h5 className="mb-3">Informacije o računu</h5>
                                        <p><strong>Korisničko ime:</strong> {userInfo.sub || userInfo.name}</p>
                                        <p><strong>Email:</strong> {userInfo.email || 'Nije dostupno'}</p>
                                        <p><strong>Uloga:</strong> {userInfo.role || 'Korisnik'}</p>
                                        <p><strong>Datum registracije:</strong> {new Date(userInfo.nbf * 1000).toLocaleDateString() || 'Nije dostupno'}</p>
                                    </div>
                                </Tab>
                            </Tabs>

                            <div className="text-center mt-3">
                                <Button 
                                    variant="outline-secondary"
                                    onClick={() => navigate('/')}
                                >
                                    Povratak na početnu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
