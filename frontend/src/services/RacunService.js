import { HttpService } from './HttpService';
import logger from '../utils/logger';


async function get() {
    try {
        logger.debug("RacunService.get: Dohvaćam račune s API-ja");
        const response = await HttpService.get('/racun');
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja računa:", e);
        return [];
    }
}

async function getBySifra(sifra) {
    try {
        logger.debug("RacunService.getBySifra: Dohvaćam račun s API-ja za šifru", sifra);
        const response = await HttpService.get(`/racun/${sifra}`);
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja računa:", e);
        return { sifra: parseInt(sifra), datum: new Date().toISOString(), kupacSifra: 1, kupacImePrezime: "Nepoznat" };
    }
}

async function dodaj(racun) {
    try {
        logger.debug("RacunService.dodaj: Dodajem račun putem API-ja", racun);
        let datumValue = racun.datum;
        if (!datumValue || datumValue === "") {
            datumValue = new Date().toISOString();
        }
        
        const racunZaSlanje = {
            ...racun,
            datum: datumValue,
            kupacSifra: parseInt(racun.kupacSifra) // kupac je broj
        };
        
        logger.debug("RacunService.dodaj: Šaljem podatke:", racunZaSlanje);
        const response = await HttpService.post('/racun', racunZaSlanje);
        return { greska: false, poruka: 'Račun uspješno dodan', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom dodavanja računa:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod dodavanja računa' 
        };
    }
}

async function promjena(sifra, racun) {
    try {
        logger.debug("RacunService.promjena: Mijenjam račun putem API-ja", { sifra, racun });

        let datumValue = racun.datum;
        if (!datumValue || datumValue === "") {
            datumValue = new Date().toISOString();
        }
        
        const racunZaSlanje = {
            ...racun,
            sifra: parseInt(sifra),
            datum: datumValue,
            kupacSifra: parseInt(racun.kupacSifra || 0) // kupac je broj, defaultaj na 0 ako je prazan
        };
        
        logger.debug("RacunService.promjena: Šaljem podatke:", racunZaSlanje);
        logger.debug("RacunService.promjena: URL:", `/racun/${sifra}`);
        
        const response = await HttpService.put(`/racun/${sifra}`, racunZaSlanje);
        logger.debug("RacunService.promjena: Odgovor:", response);
        
        return { greska: false, poruka: 'Račun uspješno promijenjen', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom promjene računa:", e);
        logger.error("Detalji greške:", e.response?.data);
        logger.error("Status kod:", e.response?.status);
        logger.error("Status tekst:", e.response?.statusText);
        
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod promjene računa' 
        };
    }
}

async function obrisi(sifra) {
    try {
        logger.debug("RacunService.obrisi: Brišem račun putem API-ja", sifra);
        await HttpService.delete(`/racun/${sifra}`);
        return { greska: false, poruka: 'Račun uspješno obrisan' };
    } catch (e) {
        logger.error("Greška prilikom brisanja računa:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod brisanja računa' 
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
