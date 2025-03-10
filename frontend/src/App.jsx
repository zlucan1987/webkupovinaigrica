// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Route, Routes, useNavigate, useLocation, Link } from 'react-router-dom';
import { RouteNames } from './constants';
import KupciPregled from './pages/kupci/KupciPregled.jsx';
import KupciDodaj from './pages/kupci/KupciDodaj.jsx';
import KupciPromjena from './pages/kupci/KupciPromjena.jsx';
import ProizvodiPregled from './pages/proizvodi/ProizvodiPregled.jsx';
import ProizvodiDodaj from './pages/proizvodi/ProizvodiDodaj.jsx';
import ProizvodiPromjena from './pages/proizvodi/ProizvodiPromjena.jsx';
import RacuniPregled from './pages/racuni/RacuniPregled.jsx';
import RacuniDodaj from './pages/racuni/RacuniDodaj.jsx';
import RacuniPromjena from './pages/racuni/RacuniPromjena.jsx';
import StavkePregled from './pages/stavke/StavkePregled.jsx';
import StavkeDodaj from './pages/stavke/StavkeDodaj.jsx';
import StavkePromjena from './pages/stavke/StavkePromjena.jsx';
import Webkupovinaigrica from './components/NavBarWebkupovinaigrica.jsx';
import './App.css';
import './pages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import EntryPage from './components/EntryPage.jsx';
import SwaggerPage from './components/SwaggerPage.jsx';
import EraDiagram from './components/EraDiagram.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="app-container">
            {location.pathname === '/' ? (
                <Webkupovinaigrica />
            ) : (
                <Navbar expand="lg" className="navbar-lightgray">
                    <Navbar.Brand
                        className="ruka"
                        onClick={() => navigate('/')}
                    >
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
            )}

            <Routes>
                <Route path={RouteNames.HOME} element={<EntryPage />} />
                <Route path={RouteNames.KUPAC_PREGLED} element={<KupciPregled />} />
                <Route path={RouteNames.KUPAC_NOVI} element={<KupciDodaj />} />
                <Route path={RouteNames.KUPAC_PROMJENA} element={<KupciPromjena />} />
                <Route path={RouteNames.PROIZVOD_PREGLED} element={<ProizvodiPregled />} />
                <Route path={RouteNames.PROIZVOD_NOVI} element={<ProizvodiDodaj />} />
                <Route path={RouteNames.PROIZVOD_PROMJENA} element={<ProizvodiPromjena />} />
                <Route path={RouteNames.RACUN_PREGLED} element={<RacuniPregled />} />
                <Route path={RouteNames.RACUN_NOVI} element={<RacuniDodaj />} />
                <Route path={RouteNames.RACUN_PROMJENA} element={<RacuniPromjena />} />
                <Route path={RouteNames.STAVKA_PREGLED} element={<StavkePregled />} />
                <Route path={RouteNames.STAVKA_NOVA} element={<StavkeDodaj />} />
                <Route path={RouteNames.STAVKA_PROMJENA} element={<StavkePromjena />} />
                <Route path={RouteNames.SWAGGER} element={<SwaggerPage />} />
                <Route path={RouteNames.ERA_DIAGRAM} element={<EraDiagram />} />
            </Routes>
            <hr />
            {location.pathname !== '/' && (
                <div className="footer-navigation">
                    <Link to="/" className="copyright">
                        FrontPage
                    </Link>
                    <button onClick={handleBack} className="copyright">
                        Back
                    </button>
                </div>
            )}
            <div className="app-copyright">
                © Web kupovina igrica 2025
            </div>
        </div>
    );
}

export default App;
