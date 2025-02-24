import Navbar from 'react-bootstrap/Navbar';
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
                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Dodajte sadržaj ovdje ako je potrebno */}
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}