import { useEffect, useState } from "react";
import RacunService from "../../services/RacunService";
import { Button, Table } from "react-bootstrap";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function RacuniPregled() {
    const [racuni, setRacuni] = useState([]);
    const navigate = useNavigate();

    async function dohvatiRacune() {
        const odgovor = await RacunService.get();
        setRacuni(odgovor);
    }

    useEffect(() => {
        dohvatiRacune();
    }, []);

    function formatirajDatum(datum) {
        if (datum == null || datum === "") {
            return "Nije definirano";
        }
        return moment.utc(datum).format("DD. MM. YYYY.");
    }

    function obrisi(sifra) {
        if (!confirm("Sigurno obrisati?")) {
            return;
        }
        brisanjeRacuna(sifra);
    }

    async function brisanjeRacuna(sifra) {
        const odgovor = await RacunService.obrisi(sifra);
        if (odgovor.greska) {
            alert(odgovor.poruka);
            return;
        }
        dohvatiRacune();
    }

    return (
        <div className="racuni-komponenta">
            <Link to={RouteNames.RACUN_NOVI} className="btn btn-success siroko">
                Dodaj novi račun
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Datum izdavanja</th>
                        <th>Kupac</th>
                        <th>Šifra kupca</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {racuni &&
                        racuni.map((racun, index) => (
                            <tr key={index}>
                                <td>{formatirajDatum(racun.datum)}</td>
                                <td>{racun.kupacImePrezime}</td>
                                <td>{racun.kupacSifra}</td>
                                <td>
                                    <Button onClick={() => {
                                        console.log("Racun sifra on click:", racun.sifra);
                                        navigate(`/racuni/${racun.sifra}`);
                                    }}>
                                        Promjena
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="danger" onClick={() => obrisi(racun.sifra)}>
                                        Obriši
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
}
