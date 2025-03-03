import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation, Link } from 'react-router-dom';
import { RouteNames } from './constants';
import KupciPregled from './pages/kupci/KupciPregled.jsx';
import KupciDodaj from './pages/kupci/KupciDodaj.jsx';
import KupciPromjena from './pages/kupci/KupciPromjena.jsx';
import ProizvodiPregled from './pages/proizvodi/ProizvodiPregled.jsx';
import ProizvodiDodaj from './pages/proizvodi/ProizvodiDodaj.jsx';
import ProizvodiPromjena from './pages/proizvodi/ProizvodiPromjena.jsx';
import RacuniPregled from './pages/racuni/RacuniPregled.jsx';
import RacuniDodaj from './pages/racuni/RacuniDodaj.jsx'; // Dodajemo uvoz za RacunDodaj
import RacuniPromjena from './pages/racuni/RacuniPromjena.jsx'; // Dodajemo uvoz za RacunPromjena
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

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Webkupovinaigrica />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/kupci" element={<KupciPregled />} />
        <Route path={RouteNames.KUPAC_NOVI} element={<KupciDodaj />} />
        <Route path={RouteNames.KUPAC_PROMJENA} element={<KupciPromjena />} />
        <Route path="/proizvodi" element={<ProizvodiPregled />} />
        <Route path={RouteNames.PROIZVOD_NOVI} element={<ProizvodiDodaj />} />
        <Route path={RouteNames.PROIZVOD_PROMJENA} element={<ProizvodiPromjena />} />
        <Route path="/racuni" element={<RacuniPregled />} /> {/* Dodajemo rutu za RacunPregled */}
        <Route path={RouteNames.RACUN_NOVI} element={<RacuniDodaj />} /> {/* Dodajemo rutu za RacunDodaj */}
        <Route path={RouteNames.RACUN_PROMJENA} element={<RacuniPromjena />} /> {/* Dodajemo rutu za RacunPromjena */}
        <Route path="/swagger" element={<SwaggerPage />} />
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