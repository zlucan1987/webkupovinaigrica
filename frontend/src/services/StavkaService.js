import { HttpService } from "./HttpService";

async function get() {
  return await HttpService.get('/Stavka')
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function getBySifra(sifra) {
  return await HttpService.get('/Stavka/' + sifra)
    .then((odgovor) => {
      return odgovor.data;
    })
    .catch((e) => { console.error(e) });
}

async function dodaj(stavka) {
  return HttpService.post('/Stavka', stavka)
    .then(() => { return { greska: false, poruka: 'Dodano' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod dodavanja' } });
}

async function promjena(sifra, stavka) {
  return HttpService.put('/Stavka/' + sifra, stavka)
    .then(() => { return { greska: false, poruka: 'Promjenjeno' } })
    .catch((e) => { console.error(e); return { greska: true, poruka: 'Problem kod promjene' } });
}

async function obrisi(sifra) {
  return HttpService.delete('/Stavka/' + sifra)
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