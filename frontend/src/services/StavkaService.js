import { HttpService } from './HttpService';
import logger from '../utils/logger';

// Dohvaća sve stavke za sve račune
async function get() {
  try {
    // Direktni pristup nije podržan - odmah koristimo alternativni pristup
    // Dohvati sve račune
    const racuniResponse = await HttpService.get('/racun');
    
    // Zatim paralelno dohvati stavke za sve račune
    const stavkePromises = racuniResponse.data.map(racun => 
      HttpService.get(`/racun/${racun.sifra}/stavke`)
        .then(response => response.data)
        .catch(error => {
          logger.error(`Greška za račun ${racun.sifra}:`, error.message);
          return [];
        })
    );
    
    // Čekaj da se svi paralelni pozivi završe
    const rezultatiStavki = await Promise.all(stavkePromises);
    
    // Spoji sve rezultate u jedan array
    const sveStavke = rezultatiStavki.flat();
    
    return sveStavke;
  } catch (e) {
    logger.error("Greška prilikom dohvaćanja stavki:", e.message);
    return [];
  }
}

// Dohvaća stavku po šifri 
async function getBySifra(sifra) {
  try {
    // Direktni pristup nije podržan - odmah koristimo alternativni pristup
    // Dohvati sve račune
    const racuniResponse = await HttpService.get('/racun');
    
    // Paralelno dohvati stavke za sve račune
    const stavkePromises = racuniResponse.data.map(racun => 
      HttpService.get(`/racun/${racun.sifra}/stavke`)
        .then(response => {
          if (Array.isArray(response.data)) {
            const trazenaStavka = response.data.find(s => s.sifra === parseInt(sifra));
            if (trazenaStavka) {
              return { ...trazenaStavka, racunSifra: racun.sifra };
            }
          }
          return null;
        })
        .catch(() => null)
    );
    
    // Čekaj da se svi paralelni pozivi završe
    const rezultati = await Promise.all(stavkePromises);
    
    // Filtriraj null rezultate i uzmi prvi pronađeni
    const pronadenaStavka = rezultati.find(stavka => stavka !== null);
    
    if (pronadenaStavka) {
      return pronadenaStavka;
    }
    
    return { sifra: parseInt(sifra), racunSifra: 1, proizvodSifra: 1, proizvodNaziv: "Nepoznat", kolicina: 1, cijena: 0 };
  } catch (e) {
    logger.error("Greška prilikom dohvaćanja stavke:", e.message);
    return { sifra: parseInt(sifra), racunSifra: 1, proizvodSifra: 1, proizvodNaziv: "Nepoznat", kolicina: 1, cijena: 0 };
  }
}

// Dodaje novu stavku na račun
async function dodaj(stavka) {
  try {
    const racunSifra = parseInt(stavka.racunSifra);
    if (isNaN(racunSifra)) {
      throw new Error("Šifra računa nije valjana");
    }
    
    const stavkaZaSlanje = { 
      proizvodSifra: parseInt(stavka.proizvodSifra),
      kolicina: parseInt(stavka.kolicina),
      cijena: parseFloat(stavka.cijena)
    };
    
    // Direktni pristup nije podržan - odmah koristimo standardni pristup
    const response = await HttpService.post(`/racun/${racunSifra}/stavke`, stavkaZaSlanje);
    return { greska: false, poruka: 'Stavka uspješno dodana', data: response.data };
  } catch (e) {
    logger.error("Greška prilikom dodavanja stavke:", e.message);
    return { 
      greska: true, 
      poruka: e.response?.data?.message || 'Problem kod dodavanja stavke' 
    };
  }
}

// Mijenja postojeću stavku
async function promjena(sifra, stavka) {
  try {
    const racunSifra = parseInt(stavka.racunSifra);
    if (isNaN(racunSifra)) {
      throw new Error("Šifra računa nije valjana");
    }
    
    const stavkaZaSlanje = { 
      sifra: parseInt(sifra),
      proizvodSifra: parseInt(stavka.proizvodSifra),
      kolicina: parseInt(stavka.kolicina),
      cijena: parseFloat(stavka.cijena)
    };
    
    // Direktni pristup nije podržan - odmah koristimo standardni pristup
    const response = await HttpService.put(`/racun/${racunSifra}/stavke/${sifra}`, stavkaZaSlanje);
    return { greska: false, poruka: 'Stavka uspješno promijenjena', data: response.data };
  } catch (e) {
    logger.error("Greška prilikom promjene stavke:", e.message);
    return { 
      greska: true, 
      poruka: e.response?.data?.message || 'Problem kod promjene stavke' 
    };
  }
}

// Briše stavku - moramo prvo naći kojem računu pripada
async function obrisi(sifra) {
  try {
    // Direktni pristup nije podržan - odmah koristimo alternativni pristup
    // Dohvati sve račune
    const racuniResponse = await HttpService.get('/racun');
    
    // Paralelno provjeri sve račune za traženu stavku
    const stavkePromises = racuniResponse.data.map(racun => 
      HttpService.get(`/racun/${racun.sifra}/stavke`)
        .then(response => {
          if (Array.isArray(response.data)) {
            const trazenaStavka = response.data.find(s => s.sifra === parseInt(sifra));
            if (trazenaStavka) {
              return { racunSifra: racun.sifra, stavka: trazenaStavka };
            }
          }
          return null;
        })
        .catch(() => null)
    );
    
    // Čekaj da se svi paralelni pozivi završe
    const rezultati = await Promise.all(stavkePromises);
    
    // Filtriraj null rezultate i uzmi prvi pronađeni
    const pronadenaStavka = rezultati.find(rezultat => rezultat !== null);
    
    if (pronadenaStavka) {
      await HttpService.delete(`/racun/${pronadenaStavka.racunSifra}/stavke/${sifra}`);
      return { greska: false, poruka: 'Stavka uspješno obrisana' };
    }
    
    return { greska: true, poruka: 'Stavka nije pronađena' };
  } catch (e) {
    logger.error("Greška prilikom brisanja stavke:", e.message);
    return { 
      greska: true, 
      poruka: e.response?.data?.message || 'Problem kod brisanja stavke' 
    };
  }
}

export default {
  get,
  getBySifra,
  dodaj,
  promjena,
  obrisi
};
