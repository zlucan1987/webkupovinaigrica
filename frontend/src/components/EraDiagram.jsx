// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container, Image, Card } from 'react-bootstrap';

export default function EraDiagram() {
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4" style={{ color: 'white' }}>ERA Dijagram</h2>
      <div className="mt-4 text-center">
        <Image 
          src="/era-diagram.jpeg" 
          alt="ERA Dijagram" 
          fluid 
          className="mx-auto d-block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      
      <Card className="mt-5 bg-dark text-white">
        <Card.Header as="h4">Objašnjenje ERA dijagrama</Card.Header>
        <Card.Body>
          <h5>Entiteti i njihovi atributi (detaljan opis):</h5>
          <ul>
            <li>
              <strong>Operateri</strong>:
              <ul>
                <li><strong>Sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svakog operatera u sustavu.</li>
                <li><strong>KorisnickoIme</strong> (NVARCHAR(255), NOT NULL): Korisničko ime operatera za prijavu u sustav (obavezno).</li>
                <li><strong>Lozinka</strong> (NVARCHAR(255), NOT NULL): Lozinka operatera za prijavu u sustav (obavezno).</li>
                <li><strong>Ime</strong> (NVARCHAR(255), NULL): Ime operatera (nije obavezno).</li>
                <li><strong>Prezime</strong> (NVARCHAR(255), NULL): Prezime operatera (nije obavezno).</li>
                <li><strong>Aktivan</strong> (BIT, NOT NULL, DEFAULT 1): Označava je li operater aktivan u sustavu (1 = aktivan, 0 = neaktivan). Standardno je postavljeno na 1 (aktivan).</li>
                <li><strong>NickName</strong> (NVARCHAR(255), NULL): Nadimak operatera (nije obavezno).</li>
                <li><strong>NicknameLocked</strong> (BIT, NULL): Označava je li nadimak zaključan (1 = zaključan, 0 = otključan).</li>
                <li><strong>ZadnjaPromjenaLozinke</strong> (DATETIME, NULL): Datum i vrijeme zadnje promjene lozinke operatera.</li>
                <li><strong>NeuspjeliPokusajiPrijave</strong> (INT, NULL): Broj neuspjelih pokušaja prijave operatera.</li>
                <li><strong>Datumzakljucavanja</strong> (DATETIME, NULL): Datum i vrijeme zaključavanja računa operatera.</li>
                <li><strong>DatumKreiranja</strong> (DATETIME, NULL): Datum i vrijeme kreiranja računa operatera.</li>
              </ul>
            </li>
            <li>
              <strong>OperaterUloge</strong>:
              <ul>
                <li><strong>Sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svake uloge operatera.</li>
                <li><strong>Naziv</strong> (NVARCHAR(50), NOT NULL): Naziv uloge (npr. &quot;administrator&quot;, &quot;korisnik&quot;).</li>
                <li><strong>Opis</strong> (NVARCHAR(255), NULL): Opis uloge.</li>
              </ul>
            </li>
            <li>
              <strong>OperaterOperaterUloge</strong>:
              <ul>
                <li><strong>Sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svake veze između operatera i uloge.</li>
                <li><strong>OperaterId</strong> (INT, NOT NULL, FOREIGN KEY): Strani ključ koji povezuje ovu tablicu s tablicom &quot;Operateri&quot;.</li>
                <li><strong>OperaterUlogaId</strong> (INT, NOT NULL, FOREIGN KEY): Strani ključ koji povezuje ovu tablicu s tablicom &quot;OperaterUloge&quot;.</li>
              </ul>
            </li>
            <li>
              <strong>proizvodi</strong>:
              <ul>
                <li><strong>sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svakog proizvoda (igre).</li>
                <li><strong>nazivigre</strong> (VARCHAR(100), NOT NULL): Naziv igre.</li>
                <li><strong>cijena</strong> (DECIMAL(18,2), NOT NULL): Cijena igre.</li>
              </ul>
            </li>
            <li>
              <strong>kupci</strong>:
              <ul>
                <li><strong>sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svakog kupca.</li>
                <li><strong>ime</strong> (VARCHAR(50), NOT NULL): Ime kupca.</li>
                <li><strong>prezime</strong> (VARCHAR(100), NOT NULL): Prezime kupca.</li>
                <li><strong>ulica</strong> (VARCHAR(100), NOT NULL): Ulica kupca.</li>
                <li><strong>mjesto</strong> (VARCHAR(100), NOT NULL): Mjesto kupca.</li>
              </ul>
            </li>
            <li>
              <strong>racuni</strong>:
              <ul>
                <li><strong>sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svakog računa.</li>
                <li><strong>datum</strong> (DATETIME, NOT NULL): Datum i vrijeme izdavanja računa.</li>
                <li><strong>kupac</strong> (INT, NOT NULL, FOREIGN KEY): Strani ključ koji povezuje ovaj račun s kupcem iz tablice &quot;kupci&quot;.</li>
              </ul>
            </li>
            <li>
              <strong>stavke</strong>:
              <ul>
                <li><strong>sifra</strong> (INT, PRIMARY KEY): Jedinstveni brojčani identifikator svake stavke računa.</li>
                <li><strong>racun</strong> (INT, NOT NULL, FOREIGN KEY): Strani ključ koji povezuje ovu stavku s računom iz tablice &quot;racuni&quot;.</li>
                <li><strong>proizvod</strong> (INT, NOT NULL, FOREIGN KEY): Strani ključ koji povezuje ovu stavku s proizvodom iz tablice &quot;proizvodi&quot;.</li>
                <li><strong>kolicina</strong> (INT, NOT NULL): Količina proizvoda u stavci.</li>
                <li><strong>cijena</strong> (DECIMAL(18,2), NOT NULL): Cijena proizvoda u stavci.</li>
              </ul>
            </li>
          </ul>

          <h5 className="mt-4">Relacije:</h5>
          <ul>
            <li><strong>Jedan-na-više</strong>:
              <ul>
                <li>kupci → racuni (jedan kupac može imati više računa)</li>
                <li>racuni → stavke (jedan račun može imati više stavki)</li>
                <li>proizvodi → stavke (jedan proizvod se može pojaviti u više stavki)</li>
              </ul>
            </li>
            <li><strong>Više-na-više</strong>:
              <ul>
                <li>Operateri ↔ OperaterUloge (preko tablice OperaterOperaterUloge)</li>
              </ul>
            </li>
          </ul>

          <h5 className="mt-4">Ključne značajke:</h5>
          <ul>
            <li><strong>Primarni ključevi</strong>: Jedinstveno identificiraju svaki zapis u tablici, osiguravajući integritet podataka.</li>
            <li><strong>Strani ključevi</strong>: Uspostavljaju veze između tablica, osiguravajući referencijalni integritet i omogućujući povezivanje podataka.</li>
            <li><strong>Veze jedan-na-više</strong>: Predstavljaju hijerarhijske odnose između entiteta, gdje jedan entitet može biti povezan s više drugih entiteta.</li>
            <li><strong>Veza više-na-više</strong>: Omogućuje složenije odnose između entiteta, koristeći posredničku tablicu za povezivanje više zapisa iz obje tablice.</li>
            <li><strong>Tablica Operateri</strong> sadrži dodatne sigurnosne atribute, za detaljnije praćenje korisnika i sigurnost sustava.</li>
            <li><strong>Baza podataka</strong> modelira sustav za web kupovinu igrica, s entitetima koji predstavljaju ključne aspekte poslovanja, uključujući operatore, kupce, proizvode i račune.</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}
