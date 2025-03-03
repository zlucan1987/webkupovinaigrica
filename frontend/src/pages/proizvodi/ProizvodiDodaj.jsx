import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import ProizvodService from "../../services/ProizvodService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ProizvodiDodaj() {
  const navigate = useNavigate();

  async function dodaj(proizvod) {
    const odgovor = await ProizvodService.dodaj(proizvod);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.PROIZVOD_PREGLED);
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    dodaj({
      nazivIgre: podaci.get("nazivIgre"),
      cijena: podaci.get("cijena"),
    });
  }

  return (
    <div className="proizvodi-komponenta">
      Dodavanje proizvoda
      <Form onSubmit={odradiSubmit}>
        <Row className="gx-0">
          <Col md={9} className="pe-0">
            {/* Polja za unos */}
            <Form.Group controlId="nazivIgre">
              <Form.Label>Naziv igre</Form.Label>
              <Form.Control type="text" name="nazivIgre" required className="input-manja-sirina" />
            </Form.Group>

            <Form.Group controlId="cijena">
              <Form.Label>Cijena</Form.Label>
              <Form.Control type="number" step="0.01" name="cijena" className="input-manja-sirina" />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
            {/* Gumbi s ikonama */}
            <Link to={RouteNames.PROIZVOD_PREGLED} className="btn btn-danger manji-gumb mb-2">
              <FaTimesCircle className="me-1" /> Odustani
            </Link>
            <Button variant="success" type="submit" className="manji-gumb">
              <FaCheckCircle className="me-1" /> Dodaj proizvod
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}