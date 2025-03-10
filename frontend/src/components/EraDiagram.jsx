// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container, Image, Card } from 'react-bootstrap';

export default function EraDiagram() {
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">ERA Dijagram</h2>
      <div className="mt-4 text-center">
        <Image 
          src="/era-diagram.jpg" 
          alt="ERA Dijagram" 
          fluid 
          className="mx-auto d-block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      
      <Card className="mt-5 bg-dark text-white">
        <Card.Header as="h4">Objašnjenje ERA dijagrama</Card.Header>
        <Card.Body>
          <h5>Entiteti i njihovi atributi:</h5>
          <ul>
            <li>
              <strong>Kupci</strong> - Sadrži podatke o kupcima
              <ul>
                <li><strong>Sifra</strong> (PK) - Primarni ključ, jedinstveni identifikator kupca</li>
                <li><strong>Ime</strong> - Ime kupca</li>
                <li><strong>Prezime</strong> - Prezime kupca</li>
                <li><strong>Ulica</strong> - Adresa kupca</li>
                <li><strong>Mjesto</strong> - Mjesto stanovanja kupca</li>
              </ul>
            </li>
            <li>
              <strong>Proizvodi</strong> - Sadrži podatke o proizvodima (igricama)
              <ul>
                <li><strong>Sifra</strong> (PK) - Primarni ključ, jedinstveni identifikator proizvoda</li>
                <li><strong>NazivIgre</strong> - Naziv igrice</li>
                <li><strong>Cijena</strong> - Cijena proizvoda</li>
              </ul>
            </li>
            <li>
              <strong>Racuni</strong> - Sadrži podatke o računima
              <ul>
                <li><strong>Sifra</strong> (PK) - Primarni ključ, jedinstveni identifikator računa</li>
                <li><strong>Datum</strong> - Datum izdavanja računa</li>
                <li><strong>Kupac</strong> (FK) - Strani ključ koji povezuje račun s kupcem</li>
              </ul>
            </li>
            <li>
              <strong>Stavke</strong> - Sadrži podatke o stavkama na računima
              <ul>
                <li><strong>Sifra</strong> (PK) - Primarni ključ, jedinstveni identifikator stavke</li>
                <li><strong>Racun</strong> (FK) - Strani ključ koji povezuje stavku s računom</li>
                <li><strong>Proizvod</strong> (FK) - Strani ključ koji povezuje stavku s proizvodom</li>
                <li><strong>Kolicina</strong> - Količina proizvoda na stavci</li>
                <li><strong>Cijena</strong> - Cijena proizvoda na stavci</li>
              </ul>
            </li>
          </ul>

          <h5 className="mt-4">Relacije:</h5>
          <ul>
            <li><strong>Kupac → Racun</strong>: Jedan kupac može imati više računa (1:N)</li>
            <li><strong>Racun → Stavka</strong>: Jedan račun može imati više stavki (1:N)</li>
            <li><strong>Proizvod → Stavka</strong>: Jedan proizvod može biti na više stavki (1:N)</li>
          </ul>

          <h5 className="mt-4">Ključne značajke:</h5>
          <ul>
            <li>Svaki entitet ima svoj primarni ključ (PK) koji jedinstveno identificira svaki zapis</li>
            <li>Strani ključevi (FK) uspostavljaju veze između entiteta</li>
            <li>Struktura baze podataka omogućuje praćenje kupovina igrica po kupcima</li>
            <li>Moguće je pratiti koje igrice su kupljene, kada i po kojoj cijeni</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}
