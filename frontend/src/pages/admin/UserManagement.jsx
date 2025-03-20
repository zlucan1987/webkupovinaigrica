import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { HttpService } from '../../services/HttpService';
import AuthService from '../../services/AuthService';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [availableRoles] = useState(['User', 'Admin']);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await HttpService.get('/Autentifikacija/Users');
            console.log('API response data:', response.data);
            
            // Log the first user object to see its structure
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log('Prvi korisnik iz niza:', response.data[0]);
                setUsers(response.data);
            } else {
                console.error('Expected array but got:', typeof response.data);
                setError('Neočekivani format podataka od API-ja.');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Došlo je do greške prilikom dohvaćanja korisnika.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRoles = (user) => {
        setSelectedUser(user);
        setSelectedRoles(user.uloge || []);
        setShowModal(true);
    };

    const handleRoleChange = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSaveRoles = async () => {
        try {
            setUpdateSuccess(false);
            setUpdateError(null);
            
            await HttpService.put(`/Autentifikacija/Users/${selectedUser.id}/Roles`, {
                OperaterId: selectedUser.id,
                Uloge: selectedRoles
            });
            
            // Update local state
            setUsers(users.map(user => 
                user.id === selectedUser.id 
                    ? { ...user, uloge: selectedRoles } 
                    : user
            ));
            
            setUpdateSuccess(true);
            
            // Close modal after a short delay
            setTimeout(() => {
                setShowModal(false);
                setUpdateSuccess(false);
            }, 1500);
        } catch (err) {
            console.error('Error updating user roles:', err);
            setUpdateError('Došlo je do greške prilikom ažuriranja korisničkih uloga.');
        }
    };

    // Check if current user is admin
    const isCurrentUserAdmin = AuthService.hasRole('Admin');
    
    if (!isCurrentUserAdmin) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    Nemate pristup ovoj stranici. Potrebna je administratorska uloga.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Učitavanje...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4 user-management-container">
            <h2 className="mb-4">Upravljanje korisnicima</h2>
            
            <Button 
                variant="primary" 
                className="mb-3"
                onClick={fetchUsers}
            >
                Osvježi popis
            </Button>
            
            {users.length === 0 ? (
                <Alert variant="info">Nema dostupnih korisnika.</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Uloge</th>
                            <th>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.ime}</td>
                                <td>{user.prezime}</td>
                                <td>{user.korisnickoIme}</td>
                                <td>
                                    {user.uloge && user.uloge.length > 0 
                                        ? user.uloge.join(', ') 
                                        : 'Nema uloga'}
                                </td>
                                <td>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEditRoles(user)}
                                    >
                                        Uredi uloge
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            
            {/* Modal for editing roles */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi korisničke uloge</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateSuccess && (
                        <Alert variant="success">
                            Uloge su uspješno ažurirane!
                        </Alert>
                    )}
                    
                    {updateError && (
                        <Alert variant="danger">
                            {updateError}
                        </Alert>
                    )}
                    
                    {selectedUser && (
                        <div>
                            <p>
                                <strong>Korisnik:</strong> {selectedUser.ime} {selectedUser.prezime} ({selectedUser.korisnickoIme})
                            </p>
                            
                            <Form>
                                {availableRoles.map(role => (
                                    <Form.Check 
                                        key={role}
                                        type="checkbox"
                                        id={`role-${role}`}
                                        label={role}
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                    />
                                ))}
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="primary" onClick={handleSaveRoles}>
                        Spremi promjene
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;
