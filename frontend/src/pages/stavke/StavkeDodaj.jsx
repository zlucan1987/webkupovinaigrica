import { useState, useEffect } from 'react';
import RacunService from "../../services/RacunService";
import ProizvodService from "../../services/ProizvodService";
import StavkaService from "../../services/StavkaService";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Select from 'react-select';

export default function StavkeDodaj() {
    const [racuni, setRacuni] = useState([]);
    const [proizvodi, setProizvodi] = useState([]);
    const [selectedRacun, setSelectedRacun] = useState(null);
    const [selectedProizvod, setSelectedProizvod] = useState(null);
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

    // Format options for react-select
    const racunOptions = racuni.map(racun => ({
        value: racun.sifra,
        label: `Račun #${racun.sifra} - ${new Date(racun.datum).toLocaleDateString()}`
    }));

    const proizvodOptions = proizvodi.map(proizvod => ({
        value: proizvod.sifra,
        label: proizvod.nazivIgre,
        cijena: proizvod.cijena
    }));

    // Handle product selection to auto-fill price
    const handleProizvodChange = (selectedOption) => {
        setSelectedProizvod(selectedOption);
        if (selectedOption) {
            // Auto-fill the price field with the selected product's price
            document.getElementById('cijena').value = selectedOption.cijena;
        }
    };

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

        if (!selectedRacun) {
            setPoruka("Molimo odaberite račun");
            return;
        }

        if (!selectedProizvod) {
            setPoruka("Molimo odaberite proizvod");
            return;
        }

        const kolicina = document.getElementById('kolicina').value;
        const cijena = document.getElementById('cijena').value;

        if (!kolicina || !cijena) {
            setPoruka("Molimo unesite količinu i cijenu");
            return;
        }

        dodaj({
            racunSifra: selectedRacun.value,
            proizvodSifra: selectedProizvod.value,
            kolicina: kolicina,
            cijena: cijena,
        });
    }

    return (
        <div className="stavke-komponenta bijeli-tekst">
            <h2 className="mb-4">Dodavanje stavke</h2>
            {poruka && (
                <div className="alert alert-danger mb-4" role="alert">
                    {poruka}
                </div>
            )}
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="racun" className="mb-3">
                            <Form.Label>Račun:</Form.Label>
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Select
                                    options={racunOptions}
                                    value={selectedRacun}
                                    onChange={setSelectedRacun}
                                    placeholder="Pretraži i odaberi račun..."
                                    isSearchable={true}
                                    noOptionsMessage={() => "Nema rezultata"}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: '#333',
                                            borderColor: '#666',
                                            color: 'white',
                                            height: '38px',
                                            minHeight: '38px'
                                        }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            padding: '0 8px',
                                            height: '38px'
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: '#333',
                                            zIndex: 9999
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? '#555' : '#333',
                                            color: 'white',
                                            padding: '8px 12px'
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'white'
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: 'white',
                                            margin: '0',
                                            padding: '0'
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#aaa'
                                        }),
                                        indicatorsContainer: (base) => ({
                                            ...base,
                                            height: '38px'
                                        })
                                    }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="proizvod" className="mb-3">
                            <Form.Label>Proizvod:</Form.Label>
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Select
                                    options={proizvodOptions}
                                    value={selectedProizvod}
                                    onChange={handleProizvodChange}
                                    placeholder="Pretraži i odaberi proizvod..."
                                    isSearchable={true}
                                    noOptionsMessage={() => "Nema rezultata"}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: '#333',
                                            borderColor: '#666',
                                            color: 'white',
                                            height: '38px',
                                            minHeight: '38px'
                                        }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            padding: '0 8px',
                                            height: '38px'
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: '#333',
                                            zIndex: 9999
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? '#555' : '#333',
                                            color: 'white',
                                            padding: '8px 12px'
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'white'
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: 'white',
                                            margin: '0',
                                            padding: '0'
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#aaa'
                                        }),
                                        indicatorsContainer: (base) => ({
                                            ...base,
                                            height: '38px'
                                        })
                                    }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="kolicina" className="mb-3">
                            <Form.Label>Količina:</Form.Label>
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Form.Control 
                                    type="number" 
                                    name="kolicina" 
                                    style={{ 
                                        backgroundColor: '#333',
                                        borderColor: '#666',
                                        color: 'white',
                                        height: '38px'
                                    }} 
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="cijena" className="mb-3">
                            <Form.Label>Cijena:</Form.Label>
                            <div style={{ width: '100%', maxWidth: '400px' }}>
                                <Form.Control 
                                    type="number" 
                                    name="cijena" 
                                    style={{ 
                                        backgroundColor: '#333',
                                        borderColor: '#666',
                                        color: 'white',
                                        height: '38px'
                                    }} 
                                />
                            </div>
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
