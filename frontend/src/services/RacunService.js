import { HttpService } from "./HttpService";

async function get() {
    return await HttpService.get('/Racun') 
        .then((odgovor) => {
            return odgovor.data;
        })
        .catch((e) => { console.error(e) });
}

async function getBySifra(sifra) {
    return await HttpService.get('/Racun/' + sifra) 
        .then((odgovor) => {
            return odgovor.data;
        })
        .catch((e) => { console.error(e) });
}

async function dodaj(racun) {
    return HttpService.post('/Racun', racun) 
        .then(() => { return { greska: false, poruka: 'Dodano' } })
        .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod dodavanja' } });
}

async function promjena(sifra, racun) {
    return HttpService.put('/Racun/' + sifra, racun) 
        .then(() => { return { greska: false, poruka: 'Promjenjeno' } })
        .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod promjene' } });
}

async function obrisi(sifra) {
    return HttpService.delete('/Racun/' + sifra) 
        .then(() => { return { greska: false, poruka: 'Obrisano' } })
        .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod brisanja' } });
}

export default {
    get,
    getBySifra,
    dodaj,
    promjena,
    obrisi
};