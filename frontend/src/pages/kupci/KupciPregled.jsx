import { useEffect, useState } from "react";
import KupacService from "../../services/KupacService";
import RacunService from "../../services/RacunService";
import StavkaService from "../../services/StavkaService";
import ProizvodService from "../../services/ProizvodService";
import { Button, Table, Image, ListGroup, Accordion, Spinner, Badge, Modal, Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { getKupacProfilePicture, setKupacProfilePicture, DEFAULT_PROFILE_PICTURE } from "../../utils/imageUtils";
import "./KupciPregled.css"; // Uvoz CSS-a za stiliziranje
import "../../components/ProfileImage.css"; // Uvoz CSS-a za profilne slike

export default function KupciPregled() {
    const [kupciSProfilnima, setKupciSProfilnima] = useState([]);
    const [odabraniKupac, setOdabraniKupac] = useState(null);
    const [stavkeKupca, setStavkeKupca] = useState([]);
    const [racuniKupca, setRacuniKupca] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedKupacSifra, setExpandedKupacSifra] = useState(null);
    const navigate = useNavigate();
    
    // State za modal za dodavanje igrice
    const [showAddGameModal, setShowAddGameModal] = useState(false);
    const [proizvodi, setProizvodi] = useState([]);
    const [selectedProizvod, setSelectedProizvod] = useState('');
    const [kolicina, setKolicina] = useState(1);
    const [cijena, setCijena] = useState(0);
    const [addGameError, setAddGameError] = useState('');
    const [addGameSuccess, setAddGameSuccess] = useState('');
    const [addGameLoading, setAddGameLoading] = useState(false);

    async function dohvatiKupce() {
        const odgovor = await KupacService.get();
        console.log(odgovor);
        
        // Dodaj profilne slike kupcima
        if (Array.isArray(odgovor)) {
            const kupciSaSlikom = odgovor.map(kupac => ({
                ...kupac,
                profilnaSlika: getKupacProfilePicture(kupac.sifra)
            }));
            setKupciSProfilnima(kupciSaSlikom);
        }
    }
    
    // Funkcija za dohvaćanje proizvoda (igrica)
    async function dohvatiProizvode() {
        try {
            const odgovor = await ProizvodService.get();
            if (Array.isArray(odgovor)) {
                setProizvodi(odgovor);
            }
        } catch (error) {
            console.error("Greška prilikom dohvaćanja proizvoda:", error);
        }
    }

    // Funkcija za dohvaćanje računa i stavki za odabranog kupca
    async function dohvatiStavkeZaKupca(kupac) {
        // Ako je kupac već otvoren, zatvoriti ga
        if (expandedKupacSifra === kupac.sifra) {
            setExpandedKupacSifra(null);
            setOdabraniKupac(null);
            return;
        }
        
        setIsLoading(true);
        setOdabraniKupac(kupac);
        setExpandedKupacSifra(kupac.sifra);
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
        dohvatiProizvode();
    }, []);

    function obrisi(sifra) {
        if (!confirm("Sigurno obrisati?")) {
            return;
        }
        brisanjeKupca(sifra);
    }

    async function brisanjeKupca(sifra) {
        try {
            // 1. Dohvati sve račune
            const sviRacuni = await RacunService.get();
            
            // 2. Filtriraj račune koji pripadaju odabranom kupcu
            const racuniKupca = sviRacuni.filter(racun => racun.kupacSifra === sifra);
            
            if (racuniKupca.length > 0) {
                // 3. Dohvati sve stavke
                const sveStavke = await StavkaService.get();
                
                // 4. Za svaki račun, obriši njegove stavke
                for (const racun of racuniKupca) {
                    const stavkeRacuna = sveStavke.filter(stavka => stavka.racunSifra === racun.sifra);
                    
                    for (const stavka of stavkeRacuna) {
                        const odgovorStavka = await StavkaService.obrisi(stavka.sifra);
                        if (odgovorStavka.greska) {
                            console.error(`Greška pri brisanju stavke ${stavka.sifra}:`, odgovorStavka.poruka);
                        }
                    }
                    
                    // 5. Obriši račun
                    const odgovorRacun = await RacunService.obrisi(racun.sifra);
                    if (odgovorRacun.greska) {
                        console.error(`Greška pri brisanju računa ${racun.sifra}:`, odgovorRacun.poruka);
                    }
                }
            }
            
            // 6. Konačno, obriši kupca
            const odgovor = await KupacService.obrisi(sifra);
            if (odgovor.greska) {
                alert(odgovor.poruka);
                return;
            }
            
            alert("Kupac i svi povezani podaci uspješno obrisani!");
            dohvatiKupce();
        } catch (error) {
            console.error("Greška prilikom kaskadnog brisanja:", error);
            alert("Došlo je do greške prilikom brisanja kupca i povezanih podataka.");
        }
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
                        <th>Šifra</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Ulica</th>
                        <th>Mjesto</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(kupciSProfilnima) &&
                        kupciSProfilnima.map((kupac) => (
                            kupac && (
                                <>
                                    <tr key={`kupac-${kupac.sifra}`}>
                                        <td>
                                            <Image 
                                                src={kupac.profilnaSlika} 
                                                className="profile-image-sm"
                                                onError={(e) => {
                                                    // Koristi defaultnu sliku iz imageUtils
                                                    e.target.src = DEFAULT_PROFILE_PICTURE;
                                                    // Ažuriraj sliku u localStorage
                                                    setKupacProfilePicture(kupac.sifra, DEFAULT_PROFILE_PICTURE);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Badge bg="secondary">{kupac.sifra}</Badge>
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
                                    {expandedKupacSifra === kupac.sifra && (
                                        <tr key={`stavke-${kupac.sifra}`} className="stavke-row">
                                            <td colSpan="7">
                                                <div className="stavke-popup">
                                                    <div className="customer-info mb-3 p-2 bg-light rounded">
                                                        <h5>Podaci o kupcu</h5>
                                                        <p><strong>Šifra kupca:</strong> <Badge bg="primary">{kupac.sifra}</Badge></p>
                                                        <p><strong>Ime i prezime:</strong> {kupac.ime} {kupac.prezime}</p>
                                                        <p><strong>Adresa:</strong> {kupac.ulica}, {kupac.mjesto}</p>
                                                    </div>
                                                    
                                                    {isLoading ? (
                                                        <div className="text-center p-4">
                                                            <Spinner animation="border" role="status">
                                                                <span className="visually-hidden">Učitavanje...</span>
                                                            </Spinner>
                                                            <p className="mt-2">Učitavanje stavki...</p>
                                                        </div>
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
                                                                                                onClick={() => navigate(RouteNames.STAVKA_PROMJENA.replace(':sifra', stavka.sifra))}
                                                                                            >
                                                                                                Promijeni
                                                                                            </Button>
                                                                                            <Button 
                                                                                                variant="outline-danger" 
                                                                                                size="sm"
                                                                                                className="me-2"
                                                                                                onClick={() => obrisiStavku(stavka.sifra)}
                                                                                            >
                                                                                                Obriši
                                                                                            </Button>
                                                                                            <Button 
                                                                                                variant="outline-success" 
                                                                                                size="sm"
                                                                                                onClick={() => handleAddGameClick()}
                                                                                            >
                                                                                                Dodaj igricu
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
                                                        <div className="no-items-container">
                                                            <p>Nema stavki za ovog kupca.</p>
                                                            <Button 
                                                                variant="primary" 
                                                                onClick={() => handleAddGameClick()}
                                                                className="mt-2"
                                                            >
                                                                <i className="bi bi-plus-circle me-2"></i>
                                                                Dodaj prvu igricu
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )
                        ))}
                </tbody>
            </Table>

            {/* Modal za dodavanje igrice */}
            <Modal show={showAddGameModal} onHide={() => setShowAddGameModal(false)}>
                <Modal.Header closeButton style={{ color: 'black' }}>
                    <Modal.Title style={{ color: 'black' }}>Dodaj igricu za kupca</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: 'black' }}>
                    {addGameError && <Alert variant="danger">{addGameError}</Alert>}
                    {addGameSuccess && <Alert variant="success">{addGameSuccess}</Alert>}
                    
                    {odabraniKupac && (
                        <div className="mb-3" style={{ color: 'black' }}>
                            <p style={{ color: 'black' }}><strong>Kupac:</strong> {odabraniKupac.ime} {odabraniKupac.prezime}</p>
                            <p style={{ color: 'black' }}><strong>Šifra kupca:</strong> {odabraniKupac.sifra}</p>
                        </div>
                    )}
                    
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'black' }}>Odaberi igricu</Form.Label>
                            <Form.Select 
                                value={selectedProizvod}
                                onChange={(e) => {
                                    setSelectedProizvod(e.target.value);
                                    // Postavi cijenu na temelju odabranog proizvoda
                                    const proizvod = proizvodi.find(p => p.sifra.toString() === e.target.value);
                                    if (proizvod) {
                                        setCijena(proizvod.cijena);
                                    }
                                }}
                            >
                                <option value="">Odaberi igricu</option>
                                {proizvodi.map(proizvod => (
                                    <option key={proizvod.sifra} value={proizvod.sifra}>
                                        {proizvod.nazivIgre} - {proizvod.cijena.toFixed(2)} €
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'black' }}>Količina</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1" 
                                value={kolicina}
                                onChange={(e) => setKolicina(parseInt(e.target.value) || 1)}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'black' }}>Cijena (€)</Form.Label>
                            <Form.Control 
                                type="number" 
                                step="0.01" 
                                value={cijena}
                                onChange={(e) => setCijena(parseFloat(e.target.value) || 0)}
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                Cijena se automatski postavlja na temelju odabrane igrice.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddGameModal(false)}>
                        Odustani
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleAddGame}
                        disabled={!selectedProizvod || kolicina < 1 || addGameLoading}
                    >
                        {addGameLoading ? 'Dodavanje...' : 'Dodaj igricu'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    
    // Funkcija koja se poziva kada korisnik klikne na "Dodaj igricu"
    function handleAddGameClick() {
        setAddGameError('');
        setAddGameSuccess('');
        setSelectedProizvod('');
        setKolicina(1);
        setCijena(0);
        setShowAddGameModal(true);
    }
    
    // Funkcija za dodavanje igrice kupcu
    async function handleAddGame() {
        if (!selectedProizvod || !odabraniKupac) {
            setAddGameError('Molimo odaberite igricu.');
            return;
        }
        
        setAddGameLoading(true);
        setAddGameError('');
        setAddGameSuccess('');
        
        try {
            // Dohvati račun za kupca ili kreiraj novi ako ne postoji
            let racunSifra;
            
            if (racuniKupca.length > 0) {
                // Koristi prvi postojeći račun
                racunSifra = racuniKupca[0].sifra;
            } else {
                // Kreiraj novi račun
                const noviRacun = {
                    kupacSifra: odabraniKupac.sifra,
                    datum: new Date().toISOString(),
                    napomena: "Automatski kreiran račun"
                };
                
                const rezultatRacun = await RacunService.dodaj(noviRacun);
                
                if (rezultatRacun.greska) {
                    setAddGameError(rezultatRacun.poruka || 'Greška prilikom kreiranja računa.');
                    setAddGameLoading(false);
                    return;
                }
                
                racunSifra = rezultatRacun.data.sifra;
            }
            
            // Kreiraj novu stavku
            const novaStavka = {
                racunSifra: racunSifra,
                proizvodSifra: parseInt(selectedProizvod),
                kolicina: kolicina,
                cijena: cijena
            };
            
            // Dodaj stavku
            const rezultat = await StavkaService.dodaj(novaStavka);
            
            if (rezultat.greska) {
                setAddGameError(rezultat.poruka || 'Greška prilikom dodavanja igrice.');
                setAddGameLoading(false);
                return;
            }
            
            // Uspješno dodana igrica
            setAddGameSuccess('Igrica uspješno dodana kupcu!');
            
            // Osvježi prikaz stavki
            setTimeout(() => {
                dohvatiStavkeZaKupca(odabraniKupac);
                setShowAddGameModal(false);
                setAddGameSuccess('');
            }, 1500);
            
        } catch (error) {
            console.error('Greška prilikom dodavanja igrice:', error);
            setAddGameError('Došlo je do greške prilikom dodavanja igrice.');
        } finally {
            setAddGameLoading(false);
        }
    }
}
