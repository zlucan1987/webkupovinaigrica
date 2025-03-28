import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RouteNames } from "../../constants";
import RacunService from "../../services/RacunService";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function RacuniDodaj() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function dodaj(racun) {
        try {
            const odgovor = await RacunService.dodaj(racun);
            if (odgovor.greska) {
                setError(odgovor.poruka);
                return;
            }
            setSuccess('Račun uspješno dodan!');
            setTimeout(() => {
                navigate(RouteNames.RACUN_PREGLED);
            }, 1500);
        } catch (err) {
            setError('Došlo je do greške prilikom dodavanja računa.');
            console.error(err);
        }
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
            <h2 className="mb-4">Dodavanje računa</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="Datum" className="mb-3">
                            <Form.Label>Datum izdavanja</Form.Label>
                            <Form.Control 
                                type="date" 
                                name="Datum" 
                                className="input-manja-sirina"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                style={{ 
                                    backgroundColor: '#333',
                                    borderColor: '#666',
                                    color: 'white',
                                    height: '38px',
                                    maxWidth: '400px'
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="Kupac" className="mb-3">
                            <Form.Label>Šifra kupca</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="Kupac" 
                                className="input-manja-sirina"
                                style={{ 
                                    backgroundColor: '#333',
                                    borderColor: '#666',
                                    color: 'white',
                                    height: '38px',
                                    maxWidth: '400px'
                                }}
                            />
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
