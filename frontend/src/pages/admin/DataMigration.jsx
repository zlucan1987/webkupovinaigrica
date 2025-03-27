import { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { migrateUserDataToServer, migrateAllUsersDataToServer } from '../../utils/migrateLocalStorage';

const DataMigration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [migrationResults, setMigrationResults] = useState([]);

    useEffect(() => {
        // Check if user is logged in
        if (!AuthService.isLoggedIn()) {
            navigate('/login');
            return;
        }

        // Check if user is admin
        setIsAdmin(AuthService.hasRole('Admin'));
    }, [navigate]);

    const handleMigrateUserData = async () => {
        setLoading(true);
        setSuccess('');
        setError('');
        setMigrationResults([]);

        try {
            const result = await migrateUserDataToServer();
            
            if (result.success) {
                setSuccess(result.message);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error migrating user data:', error);
            setError('Došlo je do greške prilikom migracije podataka.');
        } finally {
            setLoading(false);
        }
    };

    const handleMigrateAllUsersData = async () => {
        if (!isAdmin) {
            setError('Samo administrator može migrirati podatke svih korisnika.');
            return;
        }

        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const result = await migrateAllUsersDataToServer();
            
            if (result.success) {
                setSuccess(result.message);
                setMigrationResults(result.results);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error migrating all users data:', error);
            setError('Došlo je do greške prilikom migracije podataka svih korisnika.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">Migracija podataka</h3>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <p className="text-white">
                        Ova stranica omogućuje migraciju korisničkih podataka iz lokalnog spremišta preglednika (localStorage) na server.
                        Migracija je potrebna kako bi podaci bili dostupni na svim uređajima i nakon čišćenja preglednika.
                    </p>

                    <div className="mb-4">
                        <h5 className="text-white">Migracija vlastitih podataka</h5>
                        <p className="text-white">
                            Kliknite na gumb ispod kako biste migrirali svoje podatke (nadimak, postavke) na server.
                        </p>
                        <Button 
                            variant="primary" 
                            onClick={handleMigrateUserData}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Migracija u tijeku...
                                </>
                            ) : 'Migriraj moje podatke'}
                        </Button>
                    </div>

                    {isAdmin && (
                        <div className="mt-5">
                            <h5 className="text-white">Migracija podataka svih korisnika (samo za administratore)</h5>
                            <p className="text-white">
                                Kao administrator, možete migrirati podatke svih korisnika na server.
                                Ovo će dohvatiti podatke iz localStorage za sve korisnike i poslati ih na server.
                            </p>
                            <Button 
                                variant="warning" 
                                onClick={handleMigrateAllUsersData}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Migracija u tijeku...
                                    </>
                                ) : 'Migriraj podatke svih korisnika'}
                            </Button>

                            {migrationResults.length > 0 && (
                                <div className="mt-4">
                                    <h6 className="text-white">Rezultati migracije:</h6>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>ID korisnika</th>
                                                <th>Status</th>
                                                <th>Poruka</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {migrationResults.map((result, index) => (
                                                <tr key={index}>
                                                    <td>{result.userId}</td>
                                                    <td>
                                                        {result.success ? (
                                                            <span className="text-success">Uspješno</span>
                                                        ) : (
                                                            <span className="text-danger">Neuspješno</span>
                                                        )}
                                                    </td>
                                                    <td>{result.message}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </Card.Body>
                <Card.Footer>
                    <Button 
                        variant="outline-secondary"
                        onClick={() => navigate('/')}
                    >
                        Povratak na početnu
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default DataMigration;
