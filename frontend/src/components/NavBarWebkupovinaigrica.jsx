import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import { useLocation } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import SearchBar from './SearchBar';
import AuthService from '../services/AuthService';
import { useState, useEffect } from 'react';
import './ShoppingCart.css';
import './SearchBar.css';

export default function Webkupovinaigrica() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check login status and admin role on component mount and when location changes
        const loggedIn = AuthService.isLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
            setIsAdmin(AuthService.hasRole('Admin'));
        } else {
            setIsAdmin(false);
        }
    }, [location]);

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate(RouteNames.LOGIN);
    };

    const navbarClassName = location.pathname === '/' ? 'navbar-lightgray entry-page-navbar' : 'navbar-lightgray';

    return (
        <>
            <Navbar expand="lg" className={navbarClassName}>
                <Navbar.Brand
                    className="ruka"
                    onClick={() => navigate(RouteNames.HOME)}
                >
                    <img 
                        src="/logooo.png" 
                        alt="Web Kupovina Igrica Logo" 
                        className="navbar-logo" 
                        style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    />
                    Web Kupovina Igrica
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto d-flex align-items-center">
                        <Button 
                            variant="primary" 
                            className="me-3"
                            onClick={() => navigate(RouteNames.HOME)}
                        >
                            Home
                        </Button>

                        <Dropdown className="me-3">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Izaberite opciju
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate(RouteNames.KUPAC_PREGLED)}>Kupci</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.PROIZVOD_PREGLED)}>Proizvodi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.RACUN_PREGLED)}>Računi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.STAVKA_PREGLED)}>Stavke</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => navigate(RouteNames.SALES_GRAPH)}>Graf prodaje igrica</Dropdown.Item>
                                
                                {isAdmin && (
                                    <>
                                        <Dropdown.Divider />
                                        <Dropdown.Header>Admin opcije</Dropdown.Header>
                                        <Dropdown.Item onClick={() => navigate(RouteNames.KUPAC_NOVI)}>Dodaj kupca</Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate(RouteNames.PROIZVOD_NOVI)}>Dodaj proizvod</Dropdown.Item>
                                        <Dropdown.Item onClick={() => navigate(RouteNames.USER_MANAGEMENT)}>Upravljanje korisnicima</Dropdown.Item>
                                    </>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <Button 
                            variant="secondary" 
                            className="me-3"
                            onClick={() => navigate(RouteNames.ERA_DIAGRAM)}
                        >
                            ERA Dijagram
                        </Button>
                        
                        <Button 
                            variant="secondary"
                            className="me-3"
                            onClick={() => navigate(RouteNames.SWAGGER)}
                        >
                            Swagger
                        </Button>
                        <SearchBar />
                        <ShoppingCart />
                        
                        {isLoggedIn ? (
                            <Button 
                                variant="outline-danger"
                                className="ms-3"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    variant="outline-success"
                                    className="ms-3 me-2"
                                    onClick={() => navigate(RouteNames.LOGIN)}
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="outline-primary"
                                    onClick={() => navigate(RouteNames.REGISTER)}
                                >
                                    Registracija
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
