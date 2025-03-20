import { HttpService } from './HttpService';
import logger from '../utils/logger';


async function get() {
    try {
        logger.debug("ProizvodService.get: Dohvaćam proizvode s API-ja");
        const response = await HttpService.get('/Proizvod');
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja proizvoda:", e);
        return [];
    }
}

async function getBySifra(sifra) {
    try {
        logger.debug("ProizvodService.getBySifra: Dohvaćam proizvod s API-ja za šifru", sifra);
        const response = await HttpService.get(`/Proizvod/${sifra}`);
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja proizvoda:", e);
        return { sifra: parseInt(sifra), nazivIgre: "Greška", cijena: 0 };
    }
}

async function dodaj(proizvod) {
    try {
        logger.debug("ProizvodService.dodaj: Dodajem proizvod putem API-ja", proizvod);
        // cijena mora biti broj
        const proizvodZaSlanje = {
            ...proizvod,
            cijena: parseFloat(proizvod.cijena)
        };
        
        logger.debug("ProizvodService.dodaj: Šaljem podatke:", proizvodZaSlanje);
        const response = await HttpService.post('/Proizvod', proizvodZaSlanje);
        return { greska: false, poruka: 'Proizvod uspješno dodan', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom dodavanja proizvoda:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod dodavanja proizvoda' 
        };
    }
}

async function promjena(sifra, proizvod) {
    try {
        logger.debug("ProizvodService.promjena: Mijenjam proizvod putem API-ja", { sifra, proizvod });
        // cijena i šifra moraju biti broj
        const proizvodZaSlanje = {
            ...proizvod,
            sifra: parseInt(sifra),
            cijena: parseFloat(proizvod.cijena)
        };
        
        logger.debug("ProizvodService.promjena: Šaljem podatke:", proizvodZaSlanje);
        logger.debug("ProizvodService.promjena: URL:", `/Proizvod/${sifra}`);
        
        const response = await HttpService.put(`/Proizvod/${sifra}`, proizvodZaSlanje);
        return { greska: false, poruka: 'Proizvod uspješno promijenjen', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom promjene proizvoda:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod promjene proizvoda' 
        };
    }
}

async function obrisi(sifra) {
    try {
        logger.debug("ProizvodService.obrisi: Brišem proizvod putem API-ja", sifra);
        await HttpService.delete(`/Proizvod/${sifra}`);
        return { greska: false, poruka: 'Proizvod uspješno obrisan' };
    } catch (e) {
        logger.error("Greška prilikom brisanja proizvoda:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod brisanja proizvoda' 
        };
    }
}

async function postaviSliku(sifra, base64Slika) {
    try {
        logger.debug("ProizvodService.postaviSliku: Postavljam sliku za proizvod", sifra);
        await HttpService.put(`/Proizvod/postaviSliku/${sifra}`, { 
            Base64: base64Slika 
        });
        return { greska: false, poruka: 'Slika uspješno postavljena' };
    } catch (e) {
        logger.error("Greška prilikom postavljanja slike:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod postavljanja slike' 
        };
    }
}

async function getGrafPodaci() {
    try {
        logger.debug("ProizvodService.getGrafPodaci: Dohvaćam podatke za graf s API-ja");
        const response = await HttpService.get('/Proizvod/graf');
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja podataka za graf:", e);
        return [];
    }
}

export default {
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi,
    postaviSliku,
    getGrafPodaci
};
