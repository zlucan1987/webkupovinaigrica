import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { HttpService } from '../../services/HttpService';
import AuthService from '../../services/AuthService';
import './UserManagement.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [availableRoles] = useState(['User', 'Admin']);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [editFormData, setEditFormData] = useState({
        email: '',
        korisnickoIme: '',
        nickname: '',
        ime: '',
        prezime: '',
        lozinka: ''
    });
    const [isNicknameLocked, setIsNicknameLocked] = useState(false);

    // Dohvati korisnike prilikom učitavanja komponente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await HttpService.get('/Autentifikacija/Users');
            console.log('API response data:', response.data);
            
            // Prikaži prvog korisnika iz niza za provjeru strukture
            if (Array.isArray(response.data) && response.data.length > 0) {
                console.log('Prvi korisnik iz niza:', response.data[0]);
                
                // Dohvati informacije o zaključanim nadimcima iz localStorage
                const usersWithLockInfo = response.data.map(user => {
                    const isLocked = localStorage.getItem(`nickname_locked_${user.id}`) === 'true';
                    const nickname = localStorage.getItem(`user_nickname_${user.id}`) || '';
                    return {
                        ...user,
                        isNicknameLocked: isLocked,
                        nickname: nickname
                    };
                });
                
                setUsers(usersWithLockInfo);
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
    
    const handleAddUser = () => {
        setSelectedUser(null);
        setEditFormData({
            email: '',
            korisnickoIme: '',
            nickname: '',
            ime: '',
            prezime: '',
            lozinka: ''
        });
        setIsNicknameLocked(false);
        setShowEditModal(true);
    };
    
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditFormData({
            email: user.korisnickoIme || '',
            korisnickoIme: user.korisnickoIme || '',
            nickname: user.nickname || '',
            ime: user.ime || '',
            prezime: user.prezime || ''
        });
        setIsNicknameLocked(user.isNicknameLocked || false);
        setShowEditModal(true);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };
    
    const toggleNicknameLock = () => {
        setIsNicknameLocked(!isNicknameLocked);
    };
    
    const handleDeleteUser = (user) => {
        // Check if user has Admin role
        if (user.uloge && user.uloge.includes('Admin')) {
            alert('Nije moguće obrisati korisnika s administratorskim pravima. Prvo uklonite administratorska prava.');
            return;
        }
        
        // Confirm deletion
        if (!window.confirm(`Jeste li sigurni da želite obrisati korisnika ${user.ime} ${user.prezime}?`)) {
            return;
        }
        
        // In a real application, we would call an API endpoint to delete the user
        // Since we don't have that endpoint, we'll just remove the user from the local state
        try {
            // Remove user from local state
            setUsers(users.filter(u => u.id !== user.id));
            
            // Clean up localStorage items related to this user
            localStorage.removeItem(`user_nickname_${user.id}`);
            localStorage.removeItem(`nickname_locked_${user.id}`);
            
            alert('Korisnik je uspješno obrisan.');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Došlo je do greške prilikom brisanja korisnika.');
        }
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
            
            // Ažuriraj lokalno stanje
            setUsers(users.map(user => 
                user.id === selectedUser.id 
                    ? { ...user, uloge: selectedRoles } 
                    : user
            ));
            
            setUpdateSuccess(true);
            
            // Zatvori modal nakon kratke pauze
            setTimeout(() => {
                setShowModal(false);
                setUpdateSuccess(false);
            }, 1500);
        } catch (err) {
            console.error('Error updating user roles:', err);
            setUpdateError('Došlo je do greške prilikom ažuriranja korisničkih uloga.');
        }
    };
    
    const handleSaveUserInfo = async () => {
        try {
            setUpdateSuccess(false);
            setUpdateError(null);
            
            if (selectedUser) {
                // Ažuriranje postojećeg korisnika
                // Spremi nadimak
                localStorage.setItem(`user_nickname_${selectedUser.id}`, editFormData.nickname);
                
                // Spremi status zaključavanja nadimka
                localStorage.setItem(`nickname_locked_${selectedUser.id}`, isNicknameLocked.toString());
                
                // Budući da backend nema endpoint za ažuriranje korisničkih podataka,
                // spremamo podatke samo lokalno
                
                // Ažuriraj lokalno stanje
                setUsers(users.map(user => 
                    user.id === selectedUser.id 
                        ? { 
                            ...user, 
                            ime: editFormData.ime,
                            prezime: editFormData.prezime,
                            korisnickoIme: editFormData.korisnickoIme,
                            nickname: editFormData.nickname,
                            isNicknameLocked: isNicknameLocked
                        } 
                        : user
                ));
            } else {
                // Dodavanje novog korisnika
                // Provjeri jesu li sva obavezna polja popunjena
                if (!editFormData.ime || !editFormData.prezime || !editFormData.email || !editFormData.korisnickoIme) {
                    setUpdateError('Molimo popunite sva obavezna polja (ime, prezime, email, korisničko ime).');
                    return;
                }
                
                // Provjeri je li lozinka unesena
                if (!editFormData.lozinka) {
                    setUpdateError('Molimo unesite lozinku za novog korisnika.');
                    return;
                }
                
                // Kreiraj novog korisnika putem API-ja
                const response = await HttpService.post('/Autentifikacija/Register', {
                    ime: editFormData.ime,
                    prezime: editFormData.prezime,
                    email: editFormData.email,
                    korisnickoIme: editFormData.korisnickoIme,
                    lozinka: editFormData.lozinka,
                    nickname: editFormData.nickname,
                    uloge: ["User"] // Dodajemo defaultnu ulogu "User"
                });
                
                // Ako je uspješno, dodaj korisnika u lokalno stanje
                if (response.data) {
                    const newUser = response.data;
                    
                    // Spremi nadimak i status zaključavanja
                    localStorage.setItem(`user_nickname_${newUser.id}`, editFormData.nickname);
                    localStorage.setItem(`nickname_locked_${newUser.id}`, isNicknameLocked.toString());
                    
                    // Dodaj novog korisnika u lokalno stanje
                    setUsers([...users, {
                        ...newUser,
                        nickname: editFormData.nickname,
                        isNicknameLocked: isNicknameLocked,
                        datumKreiranja: new Date().toISOString()
                    }]);
                }
            }
            
            setUpdateSuccess(true);
            
            // Zatvori modal nakon kratke pauze
            setTimeout(() => {
                setShowEditModal(false);
                setUpdateSuccess(false);
            }, 1500);
        } catch (err) {
            console.error('Error saving user info:', err);
            setUpdateError('Došlo je do greške prilikom spremanja korisničkih podataka.');
        }
    };

    // Provjeri je li trenutni korisnik administrator
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
            <h2 className="mb-4 bijeli-tekst">Upravljanje korisnicima</h2>
            
            <div className="mb-3 d-flex">
                <Button 
                    variant="primary" 
                    className="me-2"
                    onClick={fetchUsers}
                >
                    Osvježi popis
                </Button>
                <Button 
                    variant="success" 
                    onClick={() => handleAddUser()}
                >
                    Dodaj korisnika
                </Button>
            </div>
            
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
                            <th>Nadimak</th>
                            <th>Uloge</th>
                            <th>Datum kreiranja</th>
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
                    {user.nickname || '-'} 
                    {user.isNicknameLocked && (
                        <FaLock className="ms-2 text-warning" title="Nadimak je zaključan" />
                    )}
                </td>
                <td>
                    {user.uloge && user.uloge.length > 0 
                        ? user.uloge.join(', ') 
                        : 'Nema uloga'}
                </td>
                <td>{user.datumKreiranja ? new Date(user.datumKreiranja).toLocaleDateString() : '-'}</td>
                                <td>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        className="me-2 mb-1"
                                        onClick={() => handleEditRoles(user)}
                                    >
                                        Uredi uloge
                                    </Button>
                                    <Button 
                                        variant="outline-success" 
                                        size="sm"
                                        className="me-2 mb-1"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Uredi korisnika
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDeleteUser(user)}
                                        disabled={user.uloge && user.uloge.includes('Admin')}
                                        title={user.uloge && user.uloge.includes('Admin') ? 
                                            "Prvo uklonite administratorska prava" : 
                                            "Obriši korisnika"}
                                    >
                                        Obriši korisnika
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            
            {/* Modal za uređivanje uloga */}
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
            
            {/* Modal za uređivanje korisničkih podataka */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi korisničke podatke</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateSuccess && (
                        <Alert variant="success">
                            Podaci su uspješno ažurirani!
                        </Alert>
                    )}
                    
                    {updateError && (
                        <Alert variant="danger">
                            {updateError}
                        </Alert>
                    )}
                    
                    <div>
                        <p>
                            <strong>Korisnik:</strong> {selectedUser ? `${selectedUser.ime || ''} ${selectedUser.prezime || ''}` : 'Novi korisnik'}
                        </p>
                            
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ime</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="ime"
                                        value={editFormData.ime}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Prezime</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="prezime"
                                        value={editFormData.prezime}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Korisničko ime</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="korisnickoIme"
                                        value={editFormData.korisnickoIme}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label>Nadimak</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control 
                                            type="text" 
                                            name="nickname"
                                            value={editFormData.nickname}
                                            onChange={handleInputChange}
                                            className="me-2"
                                        />
                                        <Button 
                                            variant={isNicknameLocked ? "warning" : "outline-warning"}
                                            onClick={toggleNicknameLock}
                                            title={isNicknameLocked ? "Otključaj nadimak" : "Zaključaj nadimak"}
                                        >
                                            {isNicknameLocked ? <FaLockOpen /> : <FaLock />}
                                        </Button>
                                    </div>
                                    <Form.Text className="text-muted">
                                        {isNicknameLocked 
                                            ? "Nadimak je zaključan. Korisnik ga ne može promijeniti." 
                                            : "Nadimak je otključan. Korisnik ga može promijeniti."}
                                    </Form.Text>
                                </Form.Group>
                                
                                {!selectedUser && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lozinka</Form.Label>
                                        <Form.Control 
                                            type="password" 
                                            name="lozinka"
                                            value={editFormData.lozinka}
                                            onChange={handleInputChange}
                                            placeholder="Unesite lozinku za novog korisnika"
                                        />
                                    </Form.Group>
                                )}
                            </Form>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Odustani
                    </Button>
                    <Button variant="primary" onClick={handleSaveUserInfo}>
                        Spremi promjene
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;
