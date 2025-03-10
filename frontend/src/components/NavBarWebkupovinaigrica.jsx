// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
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
                    <Nav className="mx-auto d-flex align-items-center">
                        <Dropdown className="me-3">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Izaberite opciju
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate(RouteNames.KUPAC_PREGLED)}>Kupci</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.PROIZVOD_PREGLED)}>Proizvodi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.RACUN_PREGLED)}>Računi</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.STAVKA_PREGLED)}>Stavke</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate(RouteNames.HOME)}>Home</Dropdown.Item>
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
                            onClick={() => navigate(RouteNames.SWAGGER)}
                        >
                            Swagger
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
