import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KupacService from "../../services/KupacService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function KupciDodaj() {
  const navigate = useNavigate();

  async function dodaj(kupac) {
    const odgovor = await KupacService.dodaj(kupac);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.KUPAC_PREGLED);
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    dodaj({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      ulica: podaci.get("ulica"),
      mjesto: podaci.get("mjesto"),
    });
  }

  return (
    <div className="kupci-komponenta bijeli-tekst">
      Dodavanje kupca
      <Form onSubmit={odradiSubmit}>
        <Row className="gx-0">
          <Col md={9} className="pe-0">
            {/* Polja za unos */}
            <Form.Group controlId="ime">
              <Form.Label>Ime</Form.Label>
              <Form.Control type="text" name="ime" required className="input-manja-sirina" />
            </Form.Group>

            <Form.Group controlId="prezime">
              <Form.Label>Prezime</Form.Label>
              <Form.Control type="text" name="prezime" className="input-manja-sirina" />
            </Form.Group>

            <Form.Group controlId="ulica">
              <Form.Label>Ulica</Form.Label>
              <Form.Control type="text" name="ulica" className="input-manja-sirina" />
            </Form.Group>

            <Form.Group controlId="mjesto">
              <Form.Label>Mjesto</Form.Label>
              <Form.Control type="text" name="mjesto" className="input-manja-sirina" />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
            {/* Gumbi s ikonama */}
            <Link to={RouteNames.KUPAC_PREGLED} className="btn btn-danger manji-gumb mb-2">
              <FaTimesCircle className="me-1" /> Odustani
            </Link>
            <Button variant="success" type="submit" className="manji-gumb">
              <FaCheckCircle className="me-1" /> Dodaj kupca
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
