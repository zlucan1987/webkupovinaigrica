import React from 'react';
import { Route, Routes, useNavigate, useLocation, Link } from 'react-router-dom';
import { RouteNames } from './constants';
import KupciPregled from './pages/kupci/KupciPregled.jsx';
import KupciDodaj from './pages/kupci/KupciDodaj.jsx';
import KupciPromjena from './pages/kupci/KupciPromjena.jsx';
import { Container } from 'react-bootstrap';
import Webkupovinaigrica from './components/NavBarWebkupovinaigrica.jsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import EntryPage from './components/EntryPage.jsx';
import SwaggerPage from './components/SwaggerPage.jsx';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Container style={{ position: 'relative', minHeight: '100vh' }}>
            <Webkupovinaigrica />
            <Routes>
                <Route path="/" element={<EntryPage />} />
                <Route path="/kupci" element={<KupciPregled />} />
                <Route path={RouteNames.KUPAC_NOVI} element={<KupciDodaj />} />
                <Route path={RouteNames.KUPAC_PROMJENA} element={<KupciPromjena />} />
                <Route path="/swagger" element={<SwaggerPage />} />
            </Routes>
            <hr />
            {location.pathname !== '/' && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '10px',
                    borderRadius: '10px',
                    position: 'relative', // Dodano
                    zIndex: '1000' // Dodano
                }}>
                    <Link to="/" className="copyright">
                        FrontPage
                    </Link>
                    <button onClick={handleBack} className="copyright">
                        Back
                    </button>
                </div>
            )}
            <div style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                textAlign: 'center',
                color: 'white',
                padding: '10px 0'
            }}>
                © Web kupovina igrica 2025
            </div>
        </Container>
    );
}

export default App;