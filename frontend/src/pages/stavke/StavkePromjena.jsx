import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StavkaService from '../../services/StavkaService.js';
import RacunService from "../../services/RacunService";
import ProizvodService from "../../services/ProizvodService";
import { RouteNames } from "../../constants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function StavkePromjena() {
  const { sifra } = useParams();
  const navigate = useNavigate();
  const [racuni, setRacuni] = useState([]);
  const [proizvodi, setProizvodi] = useState([]);
  const [stavka, setStavka] = useState(null);
  const [poruka, setPoruka] = useState('');
  // Dodajemo state za praćenje originalnog računa
  const [originalniRacunSifra, setOriginalniRacunSifra] = useState(null);

  useEffect(() => {
    async function dohvatiPodatke() {
      try {
        const stavkaData = await StavkaService.getBySifra(sifra);
        setStavka(stavkaData);
        // Spremamo originalnu šifru računa
        setOriginalniRacunSifra(stavkaData.racunSifra);

        const racuniData = await RacunService.get();
        setRacuni(racuniData);

        const proizvodiData = await ProizvodService.get();
        setProizvodi(proizvodiData);
      } catch {
        setPoruka('Greška pri učitavanju podataka.');
      }
    }
    dohvatiPodatke();
  }, [sifra]);

  async function promjeni(sifra, stavka) {
    // Koristimo originalnu šifru računa umjesto one iz forme
    const stavkaZaSlanje = {
      ...stavka,
      racunSifra: originalniRacunSifra
    };
    
    const odgovor = await StavkaService.promjena(sifra, stavkaZaSlanje);
    if (odgovor.greska) {
      setPoruka(odgovor.poruka);
      return;
    }
    navigate(RouteNames.STAVKA_PREGLED);
  }

  function odradiSubmit(e) {
    e.preventDefault();

    let podaci = new FormData(e.target);
    
    const racunSifra = podaci.get("racun");
    if (!racunSifra) {
      setPoruka("Greška prilikom promjene stavke: Morate odabrati račun");
      return;
    }
    
    const proizvodSifra = podaci.get("proizvod");
    if (!proizvodSifra) {
      setPoruka("Greška prilikom promjene stavke: Morate odabrati proizvod");
      return;
    }

    promjeni(sifra, {
      racunSifra: parseInt(racunSifra),
      proizvodSifra: parseInt(proizvodSifra),
      kolicina: podaci.get("kolicina"),
      cijena: podaci.get("cijena"),
    });
  }

  if (!stavka) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="stavke-komponenta bijeli-tekst">
      <h2>Izmjena stavke</h2>
      {poruka && <p>{poruka}</p>}
      <Form onSubmit={odradiSubmit}>
        <Row className="gx-0">
          <Col md={9} className="pe-0">
            <Form.Group controlId="racun">
              <Form.Label>Račun:</Form.Label>
              <Form.Select name="racun" defaultValue={stavka.racunSifra} className="input-manja-sirina">
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
              <Form.Select name="proizvod" defaultValue={stavka.proizvodSifra} className="input-manja-sirina">
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
              <Form.Control type="number" name="kolicina" defaultValue={stavka.kolicina} className="input-manja-sirina" />
            </Form.Group>

            <Form.Group controlId="cijena">
              <Form.Label>Cijena:</Form.Label>
              <Form.Control type="number" name="cijena" defaultValue={stavka.cijena} className="input-manja-sirina" />
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
            <Button variant="success" type="submit" className="manji-gumb">
              <FaCheckCircle className="me-1" /> Spremi izmjene
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
