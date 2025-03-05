import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import { useLocation } from 'react-router-dom';

export default function Webkupovinaigrica() {
    const navigate = useNavigate();
    const location = useLocation();

    const navbarClassName = location.pathname === '/' ? 'navbar-lightgray entry-page-navbar' : 'navbar-lightgray';

    return (
        <>
            <Navbar expand="lg" className={navbarClassName}>
                <Navbar.Brand
                    className="ruka"
                    onClick={() => navigate(RouteNames.HOME)}
                >
                    {/* Ovdje možete dodati logo ili tekst brenda */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/kupci')}>Kupci</Nav.Link>
                        <Nav.Link onClick={() => navigate('/proizvodi')}>Proizvodi</Nav.Link>
                        <Nav.Link onClick={() => navigate('/racuni')}>Računi</Nav.Link>
                        <Nav.Link onClick={() => navigate('/stavke')}>Stavke</Nav.Link>
                        <Nav.Link onClick={() => navigate('/swagger')}>Swagger</Nav.Link>
                        <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}