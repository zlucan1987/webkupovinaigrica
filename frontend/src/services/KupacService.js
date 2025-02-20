import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get('/kupac') // Promjena putanje
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function getBySifra(sifra) {
  return await HttpService.get('/kupac/' + sifra)
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function dodaj(kupac) { 
  return HttpService.post('/kupac', kupac) 
    .then(() => { return { greska: false, poruka: 'Dodano' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod dodavanja' } });
}

async function promjena(sifra, kupac) { 
  return HttpService.put('/kupac/' + sifra, kupac) 
    .then(() => { return { greska: false, poruka: 'Promjenjeno' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod promjene' } });
}

async function obrisi(sifra) {
  return HttpService.delete('/kupac/' + sifra) 
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