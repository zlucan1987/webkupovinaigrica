import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import KupacService from "../../services/KupacService";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function KupciPromjena() {
    const navigate = useNavigate();
    const [kupac, setKupac] = useState({});
    const routeParams = useParams();

    async function dohvatiKupca() {
        const odgovor = await KupacService.getBySifra(routeParams.sifra);
        setKupac(odgovor);
    }

    useEffect(() => {
        dohvatiKupca();
    }, [routeParams.sifra]);

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
        <div className="kupci-komponenta bijeli-tekst">
            Promjena kupca
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="ime">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                name="ime"
                                required
                                defaultValue={kupac.ime}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="prezime">
                            <Form.Label>Prezime</Form.Label>
                            <Form.Control
                                type="text"
                                name="prezime"
                                defaultValue={kupac.prezime}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="ulica">
                            <Form.Label>Ulica</Form.Label>
                            <Form.Control
                                type="text"
                                name="ulica"
                                defaultValue={kupac.ulica}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="mjesto">
                            <Form.Label>Mjesto</Form.Label>
                            <Form.Control
                                type="text"
                                name="mjesto"
                                defaultValue={kupac.mjesto}
                                className="input-manja-sirina"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Link to={RouteNames.KUPAC_PREGLED} className="btn btn-danger manji-gumb mb-2">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Link>
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Promjeni kupca
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}