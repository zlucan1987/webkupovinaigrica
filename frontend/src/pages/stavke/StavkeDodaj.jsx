import { useState, useEffect } from 'react';
import RacunService from "../../services/RacunService";
import ProizvodService from "../../services/ProizvodService";
import StavkaService from "../../services/StavkaService";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function StavkeDodaj() {
    const [racuni, setRacuni] = useState([]);
    const [proizvodi, setProizvodi] = useState([]);
    const [poruka, setPoruka] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function dohvatiRacune() {
            const racuni = await RacunService.get();
            setRacuni(racuni);
        }

        async function dohvatiProizvode() {
            const proizvodi = await ProizvodService.get();
            setProizvodi(proizvodi);
        }

        dohvatiRacune();
        dohvatiProizvode();
    }, []);

    async function dodaj(stavka) {
        const odgovor = await StavkaService.dodaj(stavka);
        if (odgovor.greska) {
            setPoruka(odgovor.poruka);
            return;
        }
        navigate(RouteNames.STAVKA_PREGLED);
    }

    function odradiSubmit(e) {
        e.preventDefault();

        let podaci = new FormData(e.target);

        dodaj({
            racunSifra: parseInt(podaci.get("racun")),
            proizvodSifra: parseInt(podaci.get("proizvod")),
            kolicina: podaci.get("kolicina"),
            cijena: podaci.get("cijena"),
        });
    }

    return (
        <div className="stavke-komponenta bijeli-tekst">
            Dodavanje stavke
            {poruka && <p>{poruka}</p>}
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="racun">
                            <Form.Label>Račun:</Form.Label>
                            <Form.Select name="racun" className="input-manja-sirina">
                                <option value="">Odaberi račun</option>
                                {racuni.map((racun) => (
                                    <option key={racun.sifra} value={racun.sifra}>
                                        {racun.sifra}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="proizvod">
                            <Form.Label>Proizvod:</Form.Label>
                            <Form.Select name="proizvod" className="input-manja-sirina">
                                <option value="">Odaberi proizvod</option>
                                {proizvodi.map((proizvod) => (
                                    <option key={proizvod.sifra} value={proizvod.sifra}>
                                        {proizvod.nazivIgre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="kolicina">
                            <Form.Label>Količina:</Form.Label>
                            <Form.Control type="number" name="kolicina" className="input-manja-sirina" />
                        </Form.Group>

                        <Form.Group controlId="cijena">
                            <Form.Label>Cijena:</Form.Label>
                            <Form.Control type="number" name="cijena" className="input-manja-sirina" />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                        <Button variant="success" type="submit" className="manji-gumb">
                            <FaCheckCircle className="me-1" /> Dodaj stavku
                        </Button>
                        <Button variant="danger" onClick={() => navigate(RouteNames.STAVKA_PREGLED)} className="manji-gumb">
                            <FaTimesCircle className="me-1" /> Odustani
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
