import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RacunService from "../../services/RacunService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function RacuniPromjena() {
    const navigate = useNavigate();
    const [racun, setRacun] = useState({});
    const routeParams = useParams();

    console.log("routeParams:", routeParams);

    async function dohvatiRacun() {
        const odgovor = await RacunService.getBySifra(routeParams.sifra);
        setRacun(odgovor);
    }

    useEffect(() => {
        console.log("routeParams.sifra in useEffect:", routeParams.sifra);
        console.log("racun state in useEffect:", racun);
        dohvatiRacun();
    }, [routeParams.sifra]);

    async function promjena(racun) {
        const odgovor = await RacunService.promjena(routeParams.sifra, racun);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        navigate(RouteNames.RACUN_PREGLED);
    }

    function odradiSubmit(e) {
        e.preventDefault();

        let podaci = new FormData(e.target);

        promjena({
            Datum: podaci.get("Datum"),
            Kupac: podaci.get("Kupac"),
        });
    }

    return (
        <div className="racuni-komponenta">
            Promjena računa
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="Datum">
                            <Form.Label>Datum izdavanja</Form.Label>
                            <Form.Control
                                type="date"
                                name="Datum"
                                defaultValue={racun.Datum}
                                className="input-manja-sirina"
                            />
                        </Form.Group>

                        <Form.Group controlId="Kupac">
                            <Form.Label>Šifra kupca</Form.Label>
                            <Form.Control
                                type="number"
                                name="Kupac"
                                defaultValue={racun.Kupac}
                                className="input-manja-sirina"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Link to={RouteNames.RACUN_PREGLED} className="btn btn-danger manji-gumb mb-2">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Link>
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Promjeni račun
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}