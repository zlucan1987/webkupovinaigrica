import { useEffect, useState } from "react";
import KupacService from "../../services/KupacService";
import { Button, Table, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { getRandomProfilePicture } from "../../utils/imageUtils";
import "./KupciPregled.css"; // Uvoz CSS-a za stiliziranje

export default function KupciPregled() {
    const [kupciSProfilnima, setKupciSProfilnima] = useState([]);
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
                                    <td>{kupac.ime}</td>
                                    <td>{kupac.prezime}</td>
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
        </div>
    );
}
