import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image, Card, Tab, Tabs } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
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
        const loadUserData = async () => {
            try {
                // Check if user is logged in
                if (!AuthService.isLoggedIn()) {
                    navigate('/login');
                    return;
                }

                // Get user info
                const info = AuthService.getUserInfo();
                if (!info) {
                    console.error("UserProfile: Failed to get user info");
                    setError('Došlo je do greške prilikom dohvaćanja korisničkih podataka.');
                    return;
                }
                
                console.log("UserProfile: User info loaded:", info);
                setUserInfo(info);

                // Get user profile picture
                const profilePicture = AuthService.getUserProfilePicture();
                if (profilePicture) {
                    setSelectedProfilePicture(profilePicture);
                }
                
                // Fetch the latest nickname from the server
                try {
                    await AuthService.fetchUserNicknameFromServer();
                    console.log("UserProfile: Nickname fetched from server");
                } catch (error) {
                    console.error("UserProfile: Error fetching nickname from server:", error);
                }
                
                // Force refresh the profile picture by checking if it exists on the server
                const userId = AuthService.getUserId();
                if (userId) {
                    const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${userId}.png?t=${new Date().getTime()}`;
                    
                    try {
                        // Check if the image exists on the server
                        const img = new window.Image();
                        img.onload = () => {
                            console.log("UserProfile: Image loaded successfully from server");
                            // Update the profile picture in the UI
                            setSelectedProfilePicture(serverImageUrl);
                            // Save the URL in localStorage for future use
                            AuthService.updateUserProfilePicture(serverImageUrl);
                        };
                        img.onerror = () => {
                            console.error("UserProfile: Failed to load image from URL", serverImageUrl);
                        };
                        img.src = serverImageUrl;
                    } catch (error) {
                        console.error("UserProfile: Error loading profile image:", error);
                    }
                }
            } catch (error) {
                console.error("UserProfile: Error in loadUserData:", error);
                setError('Došlo je do greške prilikom učitavanja korisničkih podataka.');
            }
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
            
            console.log("UserProfile.handleImageUpload: Uploading profile picture");
            
            // Upload the image
            const result = await AuthService.uploadProfilePicture(base64Image);
            
            if (result.success) {
                // Update the profile picture in the UI
                const newProfilePicture = AuthService.getUserProfilePicture();
                console.log("UserProfile.handleImageUpload: New profile picture URL:", newProfilePicture);
                
                setSelectedProfilePicture(newProfilePicture);
                setSuccess('Profilna slika uspješno promijenjena!');
                setTimeout(() => setSuccess(''), 3000);
                
                // Verify image is loaded - using window.Image to avoid conflict with React Bootstrap Image
                const img = new window.Image();
                img.onload = () => {
                    console.log("UserProfile.handleImageUpload: Image loaded successfully");
                };
                img.onerror = () => {
                    console.error("UserProfile.handleImageUpload: Failed to load image from URL", newProfilePicture);
                    setError('Slika je uploadana, ali ne može se prikazati. Pokušajte osvježiti stranicu.');
                };
                img.src = newProfilePicture;
            } else {
                console.error("UserProfile.handleImageUpload: Error from AuthService", result.error);
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

        // Provjeri ima li barem jedno veliko slovo
        if (!/[A-Z]/.test(passwordData.newPassword)) {
            setError('Nova lozinka mora sadržavati barem jedno veliko slovo.');
            setLoading(false);
            return;
        }

        // Provjeri ima li barem jedan broj
        if (!/\d/.test(passwordData.newPassword)) {
            setError('Nova lozinka mora sadržavati barem jedan broj.');
            setLoading(false);
            return;
        }

        // Provjeri ima li barem jedan specijalni znak
        if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
            setError('Nova lozinka mora sadržavati barem jedan specijalni znak.');
            setLoading(false);
            return;
        }

        try {
            // Pozovi API za promjenu lozinke
            const result = await AuthService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            
            if (result.success) {
                setSuccess('Lozinka uspješno promijenjena!');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setError(result.error || 'Došlo je do greške prilikom promjene lozinke.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Došlo je do greške prilikom promjene lozinke.');
        } finally {
            setLoading(false);
        }
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
                                    src={selectedProfilePicture || profilePictures[0]} 
                                    className="profile-image border border-primary"
                                    onError={(e) => {
                                        console.error("Failed to load profile image:", selectedProfilePicture);
                                        // Fallback to default image if the profile image fails to load
                                        e.target.src = profilePictures[0];
                                        
                                        // Try to load the image from the server directly
                                        if (userInfo && userInfo.nameid) {
                                            const serverImageUrl = `https://www.brutallucko.online/slike/kupci/${userInfo.nameid}.png?t=${new Date().getTime()}`;
                                            const img = new window.Image();
                                            img.onload = () => {
                                                console.log("UserProfile: Image loaded successfully from server");
                                                // Update the profile picture in the UI
                                                setSelectedProfilePicture(serverImageUrl);
                                                // Save the URL in localStorage for future use
                                                AuthService.updateUserProfilePicture(serverImageUrl);
                                            };
                                            img.src = serverImageUrl;
                                        }
                                    }}
                                />
                                <h4 className="mt-3">{(userInfo.name || userInfo.sub || 'Korisnik')}</h4>
                                <p className="text-muted">
                                    {(userInfo.email || userInfo.sub || 'Nije dostupno')}
                                </p>
                            </div>

                            <Tabs defaultActiveKey="account" className="mb-4">
                                <Tab eventKey="account" title="Podaci o računu">
                                    <div className="p-3">
                                        <h5 className="mb-3" style={{ color: 'white' }}>Informacije o računu</h5>
                                        <p style={{ color: 'white' }}><strong>Korisničko ime:</strong> {userInfo.sub || userInfo.name || 'Nije dostupno'}</p>
                                        <p style={{ color: 'white' }}><strong>Email:</strong> {AuthService.getUserEmail() || 'Nije dostupno'}</p>
                                        
                                        <p style={{ color: 'white' }}>
                                            <strong>Nadimak (Nickname):</strong> {AuthService.getUserNickname() || 'Nije postavljen'}
                                            {AuthService.isNicknameLocked() && (
                                                <FaLock className="ms-2 text-warning" title="Nadimak je zaključan" />
                                            )}
                                            <small className="d-block text-muted">
                                                (Sinkronizirano s bazom podataka)
                                            </small>
                                        </p>
                                        
                                        <p style={{ color: 'white' }}><strong>Uloga:</strong> {userInfo.role || 'Korisnik'}</p>
                                        <p style={{ color: 'white' }}><strong>Datum registracije:</strong> {userInfo.nbf ? new Date(userInfo.nbf * 1000).toLocaleDateString() : 'Nije dostupno'}</p>
                                        
                                        {/* Premješteno na kraj, nakon datuma registracije */}
                                        {!AuthService.isNicknameLocked() ? (
                                            <div className="mb-3">
                                                <Form className="mt-2">
                                                    <Form.Group>
                                                        <Form.Label style={{ color: 'white' }}>Promijeni nadimak</Form.Label>
                                                        <div className="d-flex">
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="Novi nadimak" 
                                                                id="newNickname"
                                                                className="me-2"
                                                            />
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm"
                                                                onClick={async () => {
                                                                    const newNickname = document.getElementById('newNickname').value;
                                                                    if (newNickname) {
                                                                        setLoading(true);
                                                                        try {
                                                                            const result = await AuthService.setUserNickname(newNickname);
                                                                            if (result.success) {
                                                                                setSuccess(result.warning 
                                                                                    ? 'Nadimak uspješno promijenjen! (Spremljeno lokalno jer server nije dostupan)' 
                                                                                    : 'Nadimak uspješno promijenjen i spremljen u bazu podataka!');
                                                                                setTimeout(() => setSuccess(''), 3000);
                                                                                
                                                                                // Refresh the page to update the nickname in the navbar
                                                                                setTimeout(() => {
                                                                                    window.location.reload();
                                                                                }, 1000);
                                                                            } else {
                                                                                setError(result.error || 'Došlo je do greške prilikom promjene nadimka.');
                                                                                setTimeout(() => setError(''), 3000);
                                                                            }
                                                                        } catch (error) {
                                                                            console.error('Error updating nickname:', error);
                                                                            setError('Došlo je do greške prilikom promjene nadimka.');
                                                                            setTimeout(() => setError(''), 3000);
                                                                        } finally {
                                                                            setLoading(false);
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                Spremi
                                                            </Button>
                                                        </div>
                                                    </Form.Group>
                                                </Form>
                                            </div>
                                        ) : (
                                            <Alert variant="warning" className="mt-2 p-2">
                                                <small>Nadimak je zaključan od strane administratora i ne može se promijeniti.</small>
                                            </Alert>
                                        )}
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
