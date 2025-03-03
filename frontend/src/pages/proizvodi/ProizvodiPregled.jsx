import { useEffect, useState } from "react";
import ProizvodService from "../../services/ProizvodService";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";

export default function ProizvodiPregled() {
  const [proizvodi, setProizvodi] = useState([]);
  const navigate = useNavigate();

  async function dohvatiProizvode() {
    const odgovor = await ProizvodService.get();
    setProizvodi(odgovor);
  }

  useEffect(() => {
    dohvatiProizvode();
  }, []);

  function obrisi(sifra) {
    if (!confirm("Sigurno obrisati?")) {
      return;
    }
    brisanjeProizvoda(sifra);
  }

  async function brisanjeProizvoda(sifra) {
    const odgovor = await ProizvodService.obrisi(sifra);
    if (odgovor.greska) {
      alert(odgovor.poruka);
      return;
    }
    dohvatiProizvode();
  }

  return (
    <div className="proizvodi-komponenta">
      <Link to={RouteNames.PROIZVOD_NOVI} className="btn btn-success siroko">
        Dodaj novi proizvod
      </Link>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Naziv igre</th>
            <th>Cijena</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {proizvodi &&
            proizvodi.map((proizvod, index) => (
              <tr key={index}>
                <td>{proizvod.nazivIgre}</td>
                <td>{proizvod.cijena}</td>
                <td>
                  <Button onClick={() => navigate(`/proizvodi/${proizvod.proizvodID}`)}>
                    Promjena
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="danger" onClick={() => obrisi(proizvod.proizvodID)}>
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