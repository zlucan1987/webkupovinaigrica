import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RouteNames } from './constants';
import Pocetna from './pages/Pocetna.jsx';
import KupciPregled from './pages/kupci/KupciPregled.jsx';
import KupciDodaj from './pages/kupci/KupciDodaj.jsx';
import KupciPromjena from './pages/kupci/KupciPromjena.jsx';
import { Container } from 'react-bootstrap';
import Webkupovinaigrica from './components/NavBarWebkupovinaigrica.jsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Container>
        <Webkupovinaigrica />
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.KUPAC_PREGLED} element={<KupciPregled />} />
          <Route path={RouteNames.KUPAC_NOVI} element={<KupciDodaj />} />
          <Route path={RouteNames.KUPAC_PROMJENA} element={<KupciPromjena />} />
        </Routes>
        <hr />
        <p className="copyright">&copy; Web kupovina igrica 2025</p> {/* Dodana klasa "copyright" */}
      </Container>
    </>
  );
}

export default App;