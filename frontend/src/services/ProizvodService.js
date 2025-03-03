import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get('/proizvod') // Promjena putanje
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function getBySifra(sifra) {
  return await HttpService.get('/proizvod/' + sifra)
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function dodaj(proizvod) {
  return HttpService.post('/proizvod', proizvod)
    .then(() => { return { greska: false, poruka: 'Dodano' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod dodavanja' } });
}

async function promjena(sifra, proizvod) {
  return HttpService.put('/proizvod/' + sifra, proizvod)
    .then(() => { return { greska: false, poruka: 'Promjenjeno' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod promjene' } });
}

async function obrisi(sifra) {
  return HttpService.delete('/proizvod/' + sifra)
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