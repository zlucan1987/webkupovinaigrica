import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KupacService from "../../services/KupacService"; // Promijenjeno na KupacService
import { useEffect, useState } from "react";

export default function KupciPromjena() { 

  const navigate = useNavigate();
  const [kupac, setKupac] = useState({}); 
  const routeParams = useParams();

  async function dohvatiKupca() { 
    const odgovor = await KupacService.getBySifra(routeParams.sifra); 
    setKupac(odgovor); 
  }

  function KupciPromjena() {
    return (
      <div className="kupci-komponenta"> {/* Dodajte klasu */}
        {/* ...sadržaj komponente... */}
      </div>
    );
  }
  useEffect(() => {
    dohvatiKupca(); 
  }, []);

  async function promjena(kupac) { 
    const odgovor = await KupacService.promjena(routeParams.sifra, kupac); 
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    navigate(RouteNames.KUPAC_PREGLED); 
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);

    promjena({
      ime: podaci.get("ime"),
      prezime: podaci.get("prezime"),
      ulica: podaci.get("ulica"),
      mjesto: podaci.get("mjesto"),
    });
  }

  return (
    <>
      Promjena kupca 
      <Form onSubmit={odradiSubmit}>
        <Form.Group controlId="ime">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            type="text"
            name="ime"
            required
            defaultValue={kupac.ime} 
          />
        </Form.Group>

        <Form.Group controlId="prezime">
          <Form.Label>Prezime</Form.Label>
          <Form.Control
            type="text"
            name="prezime"
            defaultValue={kupac.prezime} 
          />
        </Form.Group>

        <Form.Group controlId="ulica">
          <Form.Label>Ulica</Form.Label>
          <Form.Control
            type="text"
            name="ulica"
            defaultValue={kupac.ulica} 
          />
        </Form.Group>

        <Form.Group controlId="mjesto">
          <Form.Label>Mjesto</Form.Label>
          <Form.Control
            type="text"
            name="mjesto"
            defaultValue={kupac.mjesto} 
          />
        </Form.Group>

        <hr />

        <Row>
          <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
            <Link
              to={RouteNames.KUPAC_PREGLED} 
              className="btn btn-danger siroko"
            >
              Odustani
            </Link>
          </Col>
          <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
            <Button variant="success" type="submit" className="siroko">
              Promjeni kupca 
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}