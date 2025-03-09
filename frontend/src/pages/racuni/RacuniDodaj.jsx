import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import RacunService from "../../services/RacunService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function RacuniDodaj() {
    const navigate = useNavigate();

    async function dodaj(racun) {
        const odgovor = await RacunService.dodaj(racun);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.RACUN_PREGLED);
    }

    function odradiSubmit(e) {
        e.preventDefault();

        let podaci = new FormData(e.target);

        dodaj({
            datum: podaci.get("Datum"),
            kupacSifra: parseInt(podaci.get("Kupac")),
        });
    }

    return (
        <div className="racuni-komponenta bijeli-tekst">
            Dodavanje računa
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="Datum">
                            <Form.Label>Datum izdavanja</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="Datum" 
                                className="input-manja-sirina"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </Form.Group>

                        <Form.Group controlId="Kupac">
                            <Form.Label>Šifra kupca</Form.Label>
                            <Form.Control type="number" name="Kupac" className="input-manja-sirina" />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Link to={RouteNames.RACUN_PREGLED} className="btn btn-danger manji-gumb mb-2">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Link>
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Dodaj račun
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
