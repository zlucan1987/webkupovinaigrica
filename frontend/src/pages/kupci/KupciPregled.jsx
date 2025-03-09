import { useEffect, useState } from "react";
import KupacService from "../../services/KupacService";
import { Button, Table } from "react-bootstrap";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function KupciPregled() {
    const [kupci, setKupci] = useState([]);
    const navigate = useNavigate();

    async function dohvatiKupce() {
        const odgovor = await KupacService.get();
        console.log(odgovor);
        setKupci(odgovor);
    }

    useEffect(() => {
        dohvatiKupce();
    }, []);

    function formatirajDatum(datum) {
        if (datum == null) {
            return "Nije definirano";
        }
        return moment.utc(datum).format("DD. MM. YYYY.");
    }

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
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Ulica</th>
                        <th>Mjesto</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(kupci) &&
                        kupci.map((kupac, index) => (
                            kupac && (
                                <tr key={index}>
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
            {console.log(kupci)}
        </div>
    );
}