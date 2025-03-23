import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email entry, 2: Code verification, 3: New password
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // In a real application, we would call an API endpoint to send a reset code
            // For demonstration purposes, we'll just simulate this process
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Unesite valjanu email adresu.');
                setLoading(false);
                return;
            }
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demonstration, we'll just move to the next step
            // In a real application, this would send an email with a verification code
            console.log(`Reset password email would be sent to: ${email}`);
            
            setSuccess('Kod za resetiranje lozinke je poslan na vašu email adresu.');
            setStep(2);
        } catch (err) {
            setError('Došlo je do greške prilikom slanja koda za resetiranje. Pokušajte ponovno.');
            console.error('Reset password error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCodeVerification = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // In a real application, we would verify the code with an API call
            // For demonstration purposes, we'll just simulate this process
            
            // Check if code is entered
            if (!verificationCode.trim()) {
                setError('Unesite kod za verifikaciju.');
                setLoading(false);
                return;
            }
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demonstration, we'll just move to the next step
            // In a real application, this would verify the code with the backend
            console.log(`Verification code entered: ${verificationCode}`);
            
            // For demo purposes, accept any 6-digit code
            if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
                setError('Neispravan kod. Kod mora sadržavati 6 brojeva.');
                setLoading(false);
                return;
            }
            
            setSuccess('Kod je uspješno verificiran. Unesite novu lozinku.');
            setStep(3);
        } catch (err) {
            setError('Došlo je do greške prilikom verifikacije koda. Pokušajte ponovno.');
            console.error('Code verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate passwords
            if (newPassword.length < 6) {
                setError('Lozinka mora sadržavati najmanje 6 znakova.');
                setLoading(false);
                return;
            }
            
            if (newPassword !== confirmPassword) {
                setError('Lozinke se ne podudaraju.');
                setLoading(false);
                return;
            }
            
            // In a real application, we would call an API endpoint to reset the password
            // For demonstration purposes, we'll just simulate this process
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demonstration, we'll just show success message
            console.log(`Password would be reset for: ${email}`);
            
            setSuccess('Lozinka je uspješno resetirana. Možete se prijaviti s novom lozinkom.');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Došlo je do greške prilikom resetiranja lozinke. Pokušajte ponovno.');
            console.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Form onSubmit={handleEmailSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Unesite vašu email adresu"
                                required
                            />
                            <Form.Text className="text-muted">
                                Na ovu adresu ćemo poslati kod za resetiranje lozinke.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Slanje...' : 'Pošalji kod za resetiranje'}
                            </Button>
                        </div>
                    </Form>
                );
            case 2:
                return (
                    <Form onSubmit={handleCodeVerification}>
                        <Form.Group className="mb-3">
                            <Form.Label>Verifikacijski kod</Form.Label>
                            <Form.Control
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Unesite 6-znamenkasti kod"
                                required
                            />
                            <Form.Text className="text-muted">
                                Unesite kod koji smo poslali na vašu email adresu.
                            </Form.Text>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? 'Verifikacija...' : 'Verificiraj kod'}
                            </Button>
                        </div>
                    </Form>
                );
            case 3:
                return (
                    <Form onSubmit={handlePasswordReset}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nova lozinka</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Unesite novu lozinku"
                                required
                                minLength={6}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Potvrdite novu lozinku</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {loading ? 'Resetiranje...' : 'Resetiraj lozinku'}
                            </Button>
                        </div>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={6} lg={5} className="login-form-container">
                    <h2 className="text-center mb-4">Resetiranje lozinke</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    
                    {renderStep()}
                    
                    <div className="text-center mt-3">
                        <p>
                            Sjetili ste se lozinke?{' '}
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                navigate('/login');
                            }}>
                                Prijavite se
                            </a>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
