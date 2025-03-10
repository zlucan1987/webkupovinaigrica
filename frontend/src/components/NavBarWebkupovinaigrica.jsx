import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import { useLocation } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import SearchBar from './SearchBar';
import './ShoppingCart.css';
import './SearchBar.css';

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
                        <SearchBar />
                        <ShoppingCart />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
