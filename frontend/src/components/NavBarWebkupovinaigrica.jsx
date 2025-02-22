import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';

export default function Webkupovinaigrica() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar expand="lg" className="navbar-lightgray">
                <Container>
                    <Navbar.Brand
                        className="ruka"
                        onClick={() => navigate(RouteNames.HOME)}
                    >
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}