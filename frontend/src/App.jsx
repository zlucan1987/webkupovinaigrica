import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RouteNames } from './constants';
import AuthService from './services/AuthService';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ManualTokenLogin from './pages/auth/ManualTokenLogin';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
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
import SalesGraph from './components/SalesGraph.jsx';
import Webkupovinaigrica from './components/NavBarWebkupovinaigrica.jsx';
import './App.css';
import './pages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './components/Footer';
import EntryPage from './components/EntryPage.jsx';
import SwaggerPage from './components/SwaggerPage.jsx';
import EraDiagram from './components/EraDiagram.jsx';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { CartProvider } from './context/CartContext';

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // Check login status on component mount and when location changes
        setIsLoggedIn(AuthService.isLoggedIn());
    }, [location]);
    
    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
        navigate(RouteNames.LOGIN);
    };

    return (
        <CartProvider>
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
                            
                            {isLoggedIn ? (
                                <Button 
                                    variant="outline-danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        variant="outline-success"
                                        className="me-2"
                                        onClick={() => navigate(RouteNames.LOGIN)}
                                    >
                                        Login
                                    </Button>
                                    <Button 
                                        variant="outline-primary"
                                        className="me-2"
                                        onClick={() => navigate(RouteNames.REGISTER)}
                                    >
                                        Registracija
                                    </Button>
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => navigate(RouteNames.MANUAL_TOKEN)}
                                    >
                                        Use Token
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )}

            <Routes>
                <Route path={RouteNames.HOME} element={<EntryPage />} />
                <Route path={RouteNames.LOGIN} element={<Login />} />
                <Route path={RouteNames.REGISTER} element={<Register />} />
                <Route path={RouteNames.MANUAL_TOKEN} element={<ManualTokenLogin />} />
                <Route path={RouteNames.KUPAC_PREGLED} element={
                    <ProtectedRoute>
                        <KupciPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.KUPAC_NOVI} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <KupciDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.KUPAC_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <KupciPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_PREGLED} element={
                    <ProtectedRoute>
                        <ProizvodiPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_NOVI} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <ProizvodiDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.PROIZVOD_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <ProizvodiPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_PREGLED} element={
                    <ProtectedRoute>
                        <RacuniPregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_NOVI} element={
                    <ProtectedRoute>
                        <RacuniDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.RACUN_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <RacuniPromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_PREGLED} element={
                    <ProtectedRoute>
                        <StavkePregled />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_NOVA} element={
                    <ProtectedRoute>
                        <StavkeDodaj />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.STAVKA_PROMJENA} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <StavkePromjena />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.SWAGGER} element={<SwaggerPage />} />
                <Route path={RouteNames.ERA_DIAGRAM} element={<EraDiagram />} />
                <Route path={RouteNames.SALES_GRAPH} element={
                    <ProtectedRoute>
                        <SalesGraph />
                    </ProtectedRoute>
                } />
                <Route path={RouteNames.USER_MANAGEMENT} element={
                    <ProtectedRoute requiredRoles={['Admin']}>
                        <UserManagement />
                    </ProtectedRoute>
                } />
            </Routes>
            <Footer />
            </div>
        </CartProvider>
    );
}

export default App;
