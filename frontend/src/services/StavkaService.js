import { HttpService } from './HttpService';


// Dohvaća sve stavke za sve račune
async function get() {
  try {
    console.log("StavkaService.get: Dohvaćam sve stavke s API-ja");
    
    // Prvo dohvatimo sve račune
    const racuniResponse = await HttpService.get('/racun');
    console.log("StavkaService.get: Dohvaćeni računi:", racuniResponse.data);
    
    // Zatim za svaki račun dohvatimo njegove stavke
    let sveStavke = [];
    for (const racun of racuniResponse.data) {
      try {
        console.log(`StavkaService.get: Dohvaćam stavke za račun ${racun.sifra}`);
        const stavkeResponse = await HttpService.get(`/racun/${racun.sifra}/stavke`);
        console.log(`StavkaService.get: Dohvaćene stavke za račun ${racun.sifra}:`, stavkeResponse.data);
        
        // Dodajemo stavke u ukupnu listu
        if (Array.isArray(stavkeResponse.data)) {
          sveStavke = [...sveStavke, ...stavkeResponse.data];
        }
      } catch (stavkeError) {
        console.error(`Greška prilikom dohvaćanja stavki za račun ${racun.sifra}:`, stavkeError);
      }
    }
    
    console.log("StavkaService.get: Sve dohvaćene stavke:", sveStavke);
    return sveStavke;
  } catch (e) {
    console.error("Greška prilikom dohvaćanja stavki:", e);
    console.error("Detalji greške:", e.response?.data);
    console.error("Status kod:", e.response?.status);
    console.error("Status tekst:", e.response?.statusText);
    
    return [];
  }
}

// Dohvaća stavku po šifri 
async function getBySifra(sifra) {
  try {
    console.log("StavkaService.getBySifra: Dohvaćam stavku s API-ja za šifru", sifra);
    
    // Prvo dohvatimo sve račune
    const racuniResponse = await HttpService.get('/racun');
    
    // Zatim za svaki račun dohvatimo njegove stavke i tražimo stavku s traženom šifrom
    for (const racun of racuniResponse.data) {
      try {
        const stavkeResponse = await HttpService.get(`/racun/${racun.sifra}/stavke`);
        
        if (Array.isArray(stavkeResponse.data)) {
          const trazenaStavka = stavkeResponse.data.find(s => s.sifra === parseInt(sifra));
          if (trazenaStavka) {
            console.log("StavkaService.getBySifra: Pronađena stavka:", trazenaStavka);
            return trazenaStavka;
          }
        }
      } catch (stavkeError) {
        console.error(`Greška prilikom dohvaćanja stavki za račun ${racun.sifra}:`, stavkeError);
      }
    }
    
    console.error("StavkaService.getBySifra: Stavka nije pronađena");
    return { sifra: parseInt(sifra), racunSifra: 1, proizvodSifra: 1, proizvodNaziv: "Nepoznat", kolicina: 1, cijena: 0 };
  } catch (e) {
    console.error("Greška prilikom dohvaćanja stavke:", e);
    return { sifra: parseInt(sifra), racunSifra: 1, proizvodSifra: 1, proizvodNaziv: "Nepoznat", kolicina: 1, cijena: 0 };
  }
}

// Dodaje novu stavku na račun
async function dodaj(stavka) {
  try {
    console.log("StavkaService.dodaj: Dodajem stavku putem API-ja", stavka);
    
    const racunSifra = parseInt(stavka.racunSifra);
    if (isNaN(racunSifra)) {
      throw new Error("Šifra računa nije valjana");
    }
    
    const stavkaZaSlanje = { 
      proizvodSifra: parseInt(stavka.proizvodSifra),
      kolicina: parseInt(stavka.kolicina),
      cijena: parseFloat(stavka.cijena)
    };
    
    console.log(`StavkaService.dodaj: Šaljem na /racun/${racunSifra}/stavke`, stavkaZaSlanje);
    const response = await HttpService.post(`/racun/${racunSifra}/stavke`, stavkaZaSlanje);
    return { greska: false, poruka: 'Stavka uspješno dodana', data: response.data };
  } catch (e) {
    console.error("Greška prilikom dodavanja stavke:", e);
    return { 
      greska: true, 
      poruka: e.response?.data?.message || 'Problem kod dodavanja stavke' 
    };
  }
}

// Mijenja postojeću stavku
async function promjena(sifra, stavka) {
  try {
    console.log("StavkaService.promjena: Mijenjam stavku putem API-ja", sifra, stavka);
    
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
    
    console.log(`StavkaService.promjena: Šaljem na /racun/${racunSifra}/stavke/${sifra}`, stavkaZaSlanje);
    const response = await HttpService.put(`/racun/${racunSifra}/stavke/${sifra}`, stavkaZaSlanje);
    return { greska: false, poruka: 'Stavka uspješno promijenjena', data: response.data };
  } catch (e) {
    console.error("Greška prilikom promjene stavke:", e);
    return { 
      greska: true, 
      poruka: e.response?.data?.message || 'Problem kod promjene stavke' 
    };
  }
}

// Briše stavku - moramo prvo naći kojem računu pripada
async function obrisi(sifra) {
  try {
    console.log("StavkaService.obrisi: Brišem stavku putem API-ja", sifra);
    
    // Prvo dohvatimo sve račune
    const racuniResponse = await HttpService.get('/racun');
    
    // Zatim za svaki račun dohvatimo njegove stavke i tražimo stavku s traženom šifrom
    for (const racun of racuniResponse.data) {
      try {
        const stavkeResponse = await HttpService.get(`/racun/${racun.sifra}/stavke`);
        
        if (Array.isArray(stavkeResponse.data)) {
          const trazenaStavka = stavkeResponse.data.find(s => s.sifra === parseInt(sifra));
          if (trazenaStavka) {
            console.log(`StavkaService.obrisi: Pronađena stavka na računu ${racun.sifra}, brišem...`);
            await HttpService.delete(`/racun/${racun.sifra}/stavke/${sifra}`);
            return { greska: false, poruka: 'Stavka uspješno obrisana' };
          }
        }
      } catch (stavkeError) {
        console.error(`Greška prilikom dohvaćanja stavki za račun ${racun.sifra}:`, stavkeError);
      }
    }
    
    return { greska: true, poruka: 'Stavka nije pronađena' };
  } catch (e) {
    console.error("Greška prilikom brisanja stavke:", e);
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
