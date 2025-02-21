import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { RouteNames } from './constants';
import Pocetna from './pages/Pocetna.jsx';
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
  return (
    <Container>
      <Webkupovinaigrica />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/kupci" element={<KupciPregled />} />
        <Route path={RouteNames.KUPAC_NOVI} element={<KupciDodaj />} />
        <Route path={RouteNames.KUPAC_PROMJENA} element={<KupciPromjena />} />
        <Route path="/swagger" element={<SwaggerPage />} />
        <Route path={RouteNames.HOME} element={<Pocetna />} />
      </Routes>
      <hr />
      <Link to="/" className="copyright">
        &copy; Web kupovina igrica 2025
      </Link>
    </Container>
  );
}

export default App;