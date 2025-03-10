import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

// Komponenta za podnožje web stranice
const Footer = () => {
  return (
    <footer className="footer">
      <hr className="footer-divider" />
      <Container fluid className="footer-container">
        <Row className="py-4">
          {/* Informacije o tvrtki */}
          <Col md={3} sm={6} className="mb-4">
            <h5>Informacije o tvrtki</h5>
            <p className="about-text">
              Dobrodošli u Web kupovinu igrica, vašu online destinaciju za najnovije i najpopularnije video igre! 
              Nudimo širok izbor igara za sve platforme, od PC-a i konzola do mobilnih uređaja. 
              Uživajte u sigurnoj kupovini, brzim isporukama i redovitim popustima.
            </p>
          </Col>

          {/* Kontakt informacije */}
          <Col md={3} sm={6} className="mb-4">
            <h5>Kontakt informacije</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-envelope me-2"></i>podrska@webkupovinaigrica.hr</li>
              <li><i className="bi bi-telephone me-2"></i>097 123 4567</li>
              <li><i className="bi bi-geo-alt me-2"></i>Ulica BB, Osijek</li>
            </ul>
          </Col>

          {/* Korisne poveznice */}
          <Col md={3} sm={6} className="mb-4">
            <h5>Korisne poveznice</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link"><i className="bi bi-question-circle me-2"></i>Često postavljana pitanja</a></li>
              <li><a href="#" className="footer-link"><i className="bi bi-headset me-2"></i>Korisnička podrška</a></li>
              <li><a href="#" className="footer-link"><i className="bi bi-chat-dots me-2"></i>Povratne informacije</a></li>
            </ul>
          </Col>

          {/* Društvene mreže i tim */}
          <Col md={3} sm={6} className="mb-4">
            <h5>Pratite nas</h5>
            <div className="social-icons">
              <i className="bi bi-facebook me-3"></i>
              <i className="bi bi-twitter me-3"></i>
              <i className="bi bi-instagram me-3"></i>
              <i className="bi bi-youtube"></i>
            </div>
            
            <h5 className="mt-4">O našem timu</h5>
            <p className="team-text">
              Iza &quot;Web kupovine igrica&quot; stoji strastveni tim zaljubljenika u web programiranje i web tehnologije. 
              S ponosom ističemo naš tim za web programiranje, WP7 team, predvođen iskusnim profesorom T. Jakopec.
            </p>
          </Col>
        </Row>

        {/* FAQ sekcija */}
        <Row className="faq-section py-3">
          <Col md={12}>
            <h5 className="mb-3">Često postavljana pitanja</h5>
            <Row>
              <Col md={4}>
                <div className="faq-item">
                  <h6>Kako mogu naručiti igrice?</h6>
                  <p>Jednostavno odaberite željenu igricu, dodajte je u košaricu i slijedite upute za plaćanje.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="faq-item">
                  <h6>Koje načine plaćanja prihvaćate?</h6>
                  <p>Prihvaćamo kreditne kartice, PayPal, paysafecard i plaćanje pouzećem.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="faq-item">
                  <h6>Koliko traje dostava?</h6>
                  <p>Digitalne igre su dostupne odmah, a fizičke igre dostavljamo u roku 2-5 radnih dana.</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Sigurnosni elementi i copyright */}
        <Row className="py-3 copyright-section">
          <Col md={6} className="d-flex align-items-center">
            <div className="security-badges">
              <i className="bi bi-shield-check me-2" title="SSL zaštita"></i>
              <i className="bi bi-credit-card me-2" title="Sigurno plaćanje"></i>
              <i className="bi bi-patch-check" title="Provjereni prodavač"></i>
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">© 2025 Web Kupovina Igrica powered by Edunova</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
