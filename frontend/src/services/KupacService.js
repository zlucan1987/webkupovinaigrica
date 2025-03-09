import { HttpService } from './HttpService';


async function get() {
    try {
        console.log("KupacService.get: Dohvaćam kupce s API-ja");
        const response = await HttpService.get('/Kupac');
        return response.data;
    } catch (e) {
        console.error("Greška prilikom dohvaćanja kupaca:", e);
        return [];
    }
}

async function getBySifra(sifra) {
    try {
        console.log("KupacService.getBySifra: Dohvaćam kupca s API-ja za šifru", sifra);
        const response = await HttpService.get(`/Kupac/${sifra}`);
        return response.data;
    } catch (e) {
        console.error("Greška prilikom dohvaćanja kupca:", e);
        return { sifra: parseInt(sifra), ime: "Greška", prezime: "", ulica: "", mjesto: "" };
    }
}

async function dodaj(kupac) {
    try {
        console.log("KupacService.dodaj: Dodajem kupca putem API-ja", kupac);
        console.log("KupacService.dodaj: Šaljem podatke:", kupac);
        const response = await HttpService.post('/Kupac', kupac);
        return { greska: false, poruka: 'Kupac uspješno dodan', data: response.data };
    } catch (e) {
        console.error("Greška prilikom dodavanja kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod dodavanja kupca' 
        };
    }
}

async function promjena(sifra, kupac) {
    try {
        console.log("KupacService.promjena: Mijenjam kupca putem API-ja", sifra, kupac);
        const kupacZaSlanje = {
            ...kupac,
            sifra: parseInt(sifra)
        };
        
        console.log("KupacService.promjena: Šaljem podatke:", kupacZaSlanje);
        console.log("KupacService.promjena: URL:", `/Kupac/${sifra}`);
        
        const response = await HttpService.put(`/Kupac/${sifra}`, kupacZaSlanje);
        return { greska: false, poruka: 'Kupac uspješno promijenjen', data: response.data };
    } catch (e) {
        console.error("Greška prilikom promjene kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod promjene kupca' 
        };
    }
}

async function obrisi(sifra) {
    try {
        console.log("KupacService.obrisi: Brišem kupca putem API-ja", sifra);
        await HttpService.delete(`/Kupac/${sifra}`);
        return { greska: false, poruka: 'Kupac uspješno obrisan' };
    } catch (e) {
        console.error("Greška prilikom brisanja kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod brisanja kupca' 
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
