import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown'; 
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
                    {/*  logo ili tekst  */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Izaberite opciju
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate('/kupci')}>Kupci</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/proizvodi')}>Proizvodi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/racuni')}>Računi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/stavke')}>Stavke</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/swagger')}>Swagger</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/')}>Home</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}