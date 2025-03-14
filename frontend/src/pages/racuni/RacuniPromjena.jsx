import { useEffect, useState } from "react";
import { Button, Col, Form, Row, ListGroup, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import RacunService from "../../services/RacunService";
import ProizvodService from "../../services/ProizvodService";
import StavkaService from "../../services/StavkaService";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaPlus } from 'react-icons/fa';

export default function RacuniPromjena() {
    const navigate = useNavigate();
    const [racun, setRacun] = useState({});
    const [proizvodi, setProizvodi] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [stavkeRacuna, setStavkeRacuna] = useState([]);
    const routeParams = useParams();

    console.log("routeParams:", routeParams);

    async function dohvatiRacun() {
        const odgovor = await RacunService.getBySifra(routeParams.sifra);
        console.log("Odgovor od API-ja za racun:", odgovor);
        setRacun(odgovor);
    }

    async function dohvatiProizvode() {
        const odgovor = await ProizvodService.get();
        setProizvodi(odgovor);
    }

    async function dohvatiStavkeRacuna() {
        try {
            const stavkeOdgovor = await StavkaService.get();
            const stavkeZaRacun = stavkeOdgovor.filter(
                stavka => stavka.racunSifra === parseInt(routeParams.sifra)
            );
            setStavkeRacuna(stavkeZaRacun);
        } catch (error) {
            console.error("Greška prilikom dohvaćanja stavki računa:", error);
        }
    }

    useEffect(() => {
        console.log("routeParams.sifra in useEffect:", routeParams.sifra);
        console.log("racun state in useEffect:", racun);
        dohvatiRacun();
        dohvatiProizvode();
        dohvatiStavkeRacuna();
    }, [routeParams.sifra]);

    // Funkcija za pretraživanje proizvoda
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (term.trim() === '') {
            setSearchResults([]);
            return;
        }
        
        const filteredResults = proizvodi.filter(proizvod => 
            proizvod.nazivIgre.toLowerCase().includes(term.toLowerCase()) || 
            proizvod.sifra.toString().includes(term)
        );
        
        setSearchResults(filteredResults);
    };

    // Funkcija za dodavanje stavke na račun
    const dodajStavkuNaRacun = async (proizvod) => {
        try {
            const novaStavka = {
                racunSifra: parseInt(routeParams.sifra),
                proizvodSifra: proizvod.sifra,
                kolicina: 1,
                cijena: proizvod.cijena
            };
            
            const odgovor = await StavkaService.dodaj(novaStavka);
            
            if (!odgovor.greska) {
                alert("Stavka uspješno dodana na račun!");
                dohvatiStavkeRacuna(); // Osvježi prikaz stavki
                setSearchTerm(''); // Očisti pretragu
                setSearchResults([]); // Očisti rezultate
            } else {
                alert(`Greška: ${odgovor.poruka}`);
            }
        } catch (error) {
            console.error("Greška prilikom dodavanja stavke:", error);
            alert("Došlo je do greške prilikom dodavanja stavke na račun.");
        }
    };

    // Funkcija za brisanje stavke s računa
    async function obrisiStavku(sifra) {
        if (!confirm("Jeste li sigurni da želite obrisati ovu stavku?")) {
            return;
        }
        
        try {
            const odgovor = await StavkaService.obrisi(sifra);
            
            if (!odgovor.greska) {
                alert("Stavka uspješno obrisana!");
                dohvatiStavkeRacuna(); // Osvježi prikaz stavki
            } else {
                alert(`Greška: ${odgovor.poruka}`);
            }
        } catch (error) {
            console.error("Greška prilikom brisanja stavke:", error);
            alert("Došlo je do greške prilikom brisanja stavke.");
        }
    }

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
            datum: podaci.get("Datum"),
            kupacSifra: parseInt(podaci.get("Kupac")),
        });
    }

    return (
        <div className="racuni-komponenta bijeli-tekst">
            <h3>Promjena računa</h3>
            <Form onSubmit={odradiSubmit}>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <Form.Group controlId="Datum">
                            <Form.Label>Datum izdavanja</Form.Label>
                            <Form.Control
                                type="date"
                                name="Datum"
                                defaultValue={racun.datum ? racun.datum.split('T')[0] : ''}
                                className="input-manja-sirina"
                                // yyyy-mm-dd format za datum smo napravili custom u css-u
                            />
                        </Form.Group>

                        <Form.Group controlId="Kupac">
                            <Form.Label>Šifra kupca</Form.Label>
                            <Form.Control
                                type="number"
                                name="Kupac"
                                defaultValue={racun.kupacSifra}
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

            <div className="mt-4">
                <h4>Dodaj stavke na račun</h4>
                <Row className="gx-0">
                    <Col md={9} className="pe-0">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Pretraži proizvode po nazivu ili šifri..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="input-manja-sirina" // Dodana klasa za smanjenje širine i omogućavanje prelaska teksta u novi red
                            />
                        </InputGroup>
                    </Col>
                    <Col md={3} className="d-flex align-items-center justify-content-center">
                        {searchResults.length > 0 && (
                            <Button 
                                variant="primary" 
                                className="manji-gumb"
                                onClick={() => dodajStavkuNaRacun(searchResults[0])}
                            >
                                <FaPlus className="me-1" /> Dodaj
                            </Button>
                        )}
                    </Col>
                </Row>

                {searchResults.length > 0 && (
                    <ListGroup className="mb-4" style={{ maxWidth: '400px' }}>
                        {searchResults.map(proizvod => (
                            <ListGroup.Item 
                                key={proizvod.sifra}
                                className="d-flex align-items-center"
                                style={{ justifyContent: 'flex-start', cursor: 'pointer' }}
                                onClick={() => dodajStavkuNaRacun(proizvod)}
                            >
                                <div>
                                    <strong>{proizvod.nazivIgre}</strong> - Šifra: {proizvod.sifra}, Cijena: {proizvod.cijena} €
                                </div>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="ms-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dodajStavkuNaRacun(proizvod);
                                    }}
                                >
                                    <FaPlus />
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}

                <h4>Stavke na računu</h4>
                {stavkeRacuna.length > 0 ? (
                    <ListGroup style={{ maxWidth: '400px' }}>
                        {stavkeRacuna.map(stavka => (
                            <ListGroup.Item 
                                key={stavka.sifra}
                                className="d-flex align-items-center"
                                style={{ justifyContent: 'flex-start' }}
                            >
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    className="me-2"
                                    onClick={() => obrisiStavku(stavka.sifra)}
                                >
                                    <i className="bi bi-trash"></i> Obriši
                                </Button>
                                <div>
                                    <strong>{stavka.proizvodNaziv}</strong> - Količina: {stavka.kolicina}, Cijena: {stavka.cijena} €
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>Nema stavki na ovom računu.</p>
                )}
            </div>
        </div>
    );
}
