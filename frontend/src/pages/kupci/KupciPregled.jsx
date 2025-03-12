import { useEffect, useState } from "react";
import KupacService from "../../services/KupacService";
import RacunService from "../../services/RacunService";
import StavkaService from "../../services/StavkaService";
import { Button, Table, Image, Card, ListGroup, Accordion } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { getRandomProfilePicture } from "../../utils/imageUtils";
import "./KupciPregled.css"; // Uvoz CSS-a za stiliziranje

export default function KupciPregled() {
    const [kupciSProfilnima, setKupciSProfilnima] = useState([]);
    const [odabraniKupac, setOdabraniKupac] = useState(null);
    const [stavkeKupca, setStavkeKupca] = useState([]);
    const [racuniKupca, setRacuniKupca] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function dohvatiKupce() {
        const odgovor = await KupacService.get();
        console.log(odgovor);
        
        // Dodaj profilne slike kupcima
        if (Array.isArray(odgovor)) {
            const kupciSaSlikom = odgovor.map(kupac => ({
                ...kupac,
                profilnaSlika: getRandomProfilePicture()
            }));
            setKupciSProfilnima(kupciSaSlikom);
        }
    }

    // Funkcija za dohvaćanje računa i stavki za odabranog kupca
    async function dohvatiStavkeZaKupca(kupac) {
        setIsLoading(true);
        setOdabraniKupac(kupac);
        setStavkeKupca([]);
        setRacuniKupca([]);
        
        try {
            // Dohvati sve račune
            const sviRacuni = await RacunService.get();
            
            // Filtriraj račune koji pripadaju odabranom kupcu
            const racuniOdabranogKupca = sviRacuni.filter(
                racun => racun.kupacSifra === kupac.sifra
            );
            
            setRacuniKupca(racuniOdabranogKupca);
            
            // Dohvati sve stavke za sve račune
            const sveStavke = await StavkaService.get();
            
            // Filtriraj stavke koje pripadaju računima odabranog kupca
            const stavkeOdabranogKupca = sveStavke.filter(stavka => 
                racuniOdabranogKupca.some(racun => racun.sifra === stavka.racunSifra)
            );
            
            // Dodaj informacije o računu svakoj stavci
            const stavkeSPodacima = stavkeOdabranogKupca.map(stavka => {
                const racun = racuniOdabranogKupca.find(r => r.sifra === stavka.racunSifra);
                return {
                    ...stavka,
                    racunDatum: racun ? racun.datum : '',
                    ukupnaCijena: stavka.kolicina * stavka.cijena
                };
            });
            
            setStavkeKupca(stavkeSPodacima);
        } catch (error) {
            console.error("Greška prilikom dohvaćanja stavki za kupca:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Funkcija za brisanje stavke
    async function obrisiStavku(sifra) {
        if (!confirm("Jeste li sigurni da želite obrisati ovu stavku?")) {
            return;
        }
        
        try {
            const odgovor = await StavkaService.obrisi(sifra);
            
            if (!odgovor.greska) {
                alert("Stavka uspješno obrisana!");
                // Osvježi prikaz stavki za trenutno odabranog kupca
                if (odabraniKupac) {
                    dohvatiStavkeZaKupca(odabraniKupac);
                }
            } else {
                alert(`Greška: ${odgovor.poruka}`);
            }
        } catch (error) {
            console.error("Greška prilikom brisanja stavke:", error);
            alert("Došlo je do greške prilikom brisanja stavke.");
        }
    }

    useEffect(() => {
        dohvatiKupce();
    }, []);

    function obrisi(sifra) {
        if (!confirm("Sigurno obrisati?")) {
            return;
        }
        brisanjeKupca(sifra);
    }

    async function brisanjeKupca(sifra) {
        const odgovor = await KupacService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiKupce();
    }

    return (
        <div className="kupci-komponenta">
            <Link to={RouteNames.KUPAC_NOVI} className="btn btn-success siroko">
                Dodaj novog kupca
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Profilna slika</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Ulica</th>
                        <th>Mjesto</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(kupciSProfilnima) &&
                        kupciSProfilnima.map((kupac, index) => (
                            kupac && (
                                <tr key={index}>
                                    <td>
                                        <Image 
                                            src={kupac.profilnaSlika} 
                                            roundedCircle 
                                            width={50} 
                                            height={50} 
                                            className="profile-image"
                                        />
                                    </td>
                                    <td>
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-decoration-none" 
                                            onClick={() => dohvatiStavkeZaKupca(kupac)}
                                        >
                                            {kupac.ime}
                                        </Button>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-decoration-none" 
                                            onClick={() => dohvatiStavkeZaKupca(kupac)}
                                        >
                                            {kupac.prezime}
                                        </Button>
                                    </td>
                                    <td>{kupac.ulica}</td>
                                    <td>{kupac.mjesto}</td>
                                    <td>
                                        <Button onClick={() => navigate(`/kupci/${kupac.sifra}`)}>
                                            Promjena
                                        </Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button variant="danger" onClick={() => obrisi(kupac.sifra)}>
                                            Obriši
                                        </Button>
                                    </td>
                                </tr>
                            )
                        ))}
                </tbody>
            </Table>

            {/* Prikaz stavki odabranog kupca */}
            {odabraniKupac && (
                <Card className="mt-4">
                    <Card.Header>
                        <h4>Stavke kupca: {odabraniKupac.ime} {odabraniKupac.prezime} (Šifra: {odabraniKupac.sifra})</h4>
                    </Card.Header>
                    <Card.Body>
                        {isLoading ? (
                            <p>Učitavanje stavki...</p>
                        ) : stavkeKupca.length > 0 ? (
                            <Accordion defaultActiveKey="0">
                                {racuniKupca.map((racun, racunIndex) => {
                                    const stavkeRacuna = stavkeKupca.filter(
                                        stavka => stavka.racunSifra === racun.sifra
                                    );
                                    
                                    if (stavkeRacuna.length === 0) return null;
                                    
                                    return (
                                        <Accordion.Item key={racun.sifra} eventKey={racunIndex.toString()}>
                                            <Accordion.Header>
                                                Račun #{racun.sifra} - Datum: {new Date(racun.datum).toLocaleDateString()}
                                                {stavkeRacuna.length > 1 && (
                                                    <span className="ms-2">
                                                        - Ukupna cijena: {stavkeRacuna.reduce((total, stavka) => total + (stavka.kolicina * stavka.cijena), 0).toFixed(2)} €
                                                    </span>
                                                )}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <ListGroup>
                                                    {stavkeRacuna.map(stavka => (
                                                        <ListGroup.Item 
                                                            key={stavka.sifra}
                                                            className="d-flex justify-content-between align-items-center"
                                                        >
                                                            <div className="d-flex flex-column">
                                                                <div>
                                                                    <strong>{stavka.proizvodNaziv}</strong>
                                                                </div>
                                                                <div>
                                                                    Količina: {stavka.kolicina}, 
                                                                    Cijena: {stavka.cijena.toFixed(2)} €
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Button 
                                                                    variant="outline-primary" 
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => navigate(`/stavke/${stavka.sifra}`)}
                                                                >
                                                                    Promijeni
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm"
                                                                    onClick={() => obrisiStavku(stavka.sifra)}
                                                                >
                                                                    Obriši
                                                                </Button>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>
                        ) : (
                            <p>Nema stavki za ovog kupca.</p>
                        )}
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}
