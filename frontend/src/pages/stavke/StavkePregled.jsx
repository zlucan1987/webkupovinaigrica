import { useState, useEffect, useCallback } from 'react';
import StavkaService from '../../services/StavkaService.js';
import { useNavigate, Link } from 'react-router-dom';
import { RouteNames } from '../../constants';
import { Button, Table, Spinner } from "react-bootstrap";

export default function StavkePregled() {
  const [stavke, setStavke] = useState([]);
  const [poruka, setPoruka] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dohvatiStavke = useCallback(async () => {
    try {
      setLoading(true);
      const odgovor = await StavkaService.get();
      setStavke(odgovor);
    } catch (error) {
      console.error('Greška pri dohvaćanju stavki:', error);
      setPoruka('Greška pri dohvaćanju stavki.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dohvatiStavke();
  }, [dohvatiStavke]);

  const handleDelete = async (sifra) => {
    try {
      const odgovor = await StavkaService.obrisi(sifra);
      if (odgovor.greska) {
        setPoruka(odgovor.poruka);
      } else {
        if (stavke && Array.isArray(stavke)) {
          setStavke(stavke.filter((stavka) => stavka.sifra !== sifra));
        }
        setPoruka('Stavka uspješno obrisana.');
      }
    } catch (error) {
      console.error('Greška pri brisanju stavke:', error);
      setPoruka('Greška pri brisanju stavke.');
    }
  };

  return (
    <div className="stavke-komponenta">
      <Link to={RouteNames.STAVKA_NOVA} className="btn btn-success siroko">
        Dodaj novu stavku
      </Link>
      {poruka && <p>{poruka}</p>}
      
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </Spinner>
          <p>Učitavanje stavki...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Račun</th>
              <th>Proizvod</th>
              <th>Šifra proizvoda</th>
              <th>Količina</th>
              <th>Cijena</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {stavke && Array.isArray(stavke) && stavke.map((stavka) => (
              <tr key={stavka.sifra}>
                <td>{stavka.racunSifra}</td>
                <td>{stavka.proizvodNaziv}</td>
                <td>{stavka.proizvodSifra}</td>
                <td>{stavka.kolicina}</td>
                <td>{stavka.cijena}</td>
                <td>
                  <Button onClick={() => navigate(`/stavke/promjena/${stavka.sifra}`)}>
                    Promjena
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="danger" onClick={() => handleDelete(stavka.sifra)}>
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
