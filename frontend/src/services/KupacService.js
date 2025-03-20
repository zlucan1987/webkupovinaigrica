import { HttpService } from './HttpService';
import logger from '../utils/logger';


async function get() {
    try {
        logger.debug("KupacService.get: Dohvaćam kupce s API-ja");
        const response = await HttpService.get('/Kupac');
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja kupaca:", e);
        return [];
    }
}

async function getBySifra(sifra) {
    try {
        logger.debug("KupacService.getBySifra: Dohvaćam kupca s API-ja za šifru", sifra);
        const response = await HttpService.get(`/Kupac/${sifra}`);
        return response.data;
    } catch (e) {
        logger.error("Greška prilikom dohvaćanja kupca:", e);
        return { sifra: parseInt(sifra), ime: "Greška", prezime: "", ulica: "", mjesto: "" };
    }
}

async function dodaj(kupac) {
    try {
        logger.debug("KupacService.dodaj: Dodajem kupca putem API-ja", kupac);
        logger.debug("KupacService.dodaj: Šaljem podatke:", kupac);
        const response = await HttpService.post('/Kupac', kupac);
        return { greska: false, poruka: 'Kupac uspješno dodan', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom dodavanja kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod dodavanja kupca' 
        };
    }
}

async function promjena(sifra, kupac) {
    try {
        logger.debug("KupacService.promjena: Mijenjam kupca putem API-ja", { sifra, kupac });
        const kupacZaSlanje = {
            ...kupac,
            sifra: parseInt(sifra)
        };
        
        logger.debug("KupacService.promjena: Šaljem podatke:", kupacZaSlanje);
        logger.debug("KupacService.promjena: URL:", `/Kupac/${sifra}`);
        
        const response = await HttpService.put(`/Kupac/${sifra}`, kupacZaSlanje);
        return { greska: false, poruka: 'Kupac uspješno promijenjen', data: response.data };
    } catch (e) {
        logger.error("Greška prilikom promjene kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod promjene kupca' 
        };
    }
}

async function obrisi(sifra) {
    try {
        logger.debug("KupacService.obrisi: Brišem kupca putem API-ja", sifra);
        await HttpService.delete(`/Kupac/${sifra}`);
        return { greska: false, poruka: 'Kupac uspješno obrisan' };
    } catch (e) {
        logger.error("Greška prilikom brisanja kupca:", e);
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod brisanja kupca' 
        };
    }
}

async function postaviSliku(sifra, base64Slika) {
    try {
        logger.debug("KupacService.postaviSliku: Postavljam sliku za kupca", sifra);
        
        if (!base64Slika) {
            logger.error("KupacService.postaviSliku: Nedostaje base64 slika");
            return { 
                greska: true, 
                poruka: 'Nedostaje slika za upload' 
            };
        }
        
        const response = await HttpService.put(`/Kupac/postaviSliku/${sifra}`, { 
            Base64: base64Slika 
        });
        
        logger.debug("KupacService.postaviSliku: Odgovor servera", response.data);
        
        // Nakon uspješnog uploada, provjerimo je li slika dostupna
        const imageUrl = `https://www.brutallucko.online/slike/kupci/${sifra}.png?t=${new Date().getTime()}`;
        logger.debug("KupacService.postaviSliku: Provjeravam dostupnost slike na", imageUrl);
        
        // Verify image is loaded - using window.Image to avoid conflict with React Bootstrap Image
        const img = new window.Image();
        img.onload = () => {
            logger.debug("KupacService.postaviSliku: Image loaded successfully");
        };
        img.onerror = () => {
            logger.error("KupacService.postaviSliku: Failed to load image from URL", imageUrl);
        };
        img.src = imageUrl;
        
        // Spremamo URL u localStorage za kupca - ovo će također spremiti i u user_profile_pictures
        const { setKupacProfilePicture } = await import('../utils/imageUtils');
        setKupacProfilePicture(sifra, imageUrl);
        
        return { greska: false, poruka: 'Slika uspješno postavljena', imageUrl };
    } catch (e) {
        logger.error("Greška prilikom postavljanja slike:", e);
        logger.error("Detalji greške:", {
            message: e.message,
            status: e.response?.status,
            statusText: e.response?.statusText,
            data: e.response?.data,
            config: {
                url: e.config?.url,
                method: e.config?.method,
                data: e.config?.data
            }
        });
        return { 
            greska: true, 
            poruka: e.response?.data?.message || 'Problem kod postavljanja slike' 
        };
    }
}

export default {
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi,
    postaviSliku
};
