using Backend.Data;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Controllers
{
    /// <summary>
    /// Kontroler za početne operacije.
    /// </summary>
    /// <param name="_context">Kontekst baze podataka.</param>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PocetnaController(BackendContext _context) : ControllerBase
    {
        /// <summary>
        /// Dohvaća dostupne stavke.
        /// </summary>
        /// <returns>Lista dostupnih stavki.</returns>
        [HttpGet]
        [Route("DostupneStavke")]
        public ActionResult<List<object>> DostupneStavke()
        {
            try
            {
                var stavke = _context.Stavke.Include(s => s.Proizvod).ToList();
                var lista = new List<object>();
                foreach (var stavka in stavke)
                {
                    lista.Add(new { stavka.Proizvod.NazivIgre, stavka.Proizvod.Cijena });
                }
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća ukupan broj kupaca.
        /// </summary>
        /// <returns>Ukupan broj kupaca.</returns>
        [HttpGet]
        [Route("UkupnoKupaca")]
        public IActionResult UkupnoKupaca()
        {
            try
            {
                return Ok(new { ukupno = _context.Kupci.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća podatke za graf - broj kupaca po proizvodu.
        /// </summary>
        /// <returns>Podaci za graf.</returns>
        [HttpGet]
        [Route("GrafPodaci")]
        public IActionResult GrafPodaci()
        {
            try
            {
                var podaci = _context.Proizvodi
                    .Select(p => new
                    {
                        p.NazivIgre,
                        BrojKupaca = _context.Stavke
                            .Where(s => s.ProizvodId == p.Sifra)
                            .Select(s => s.Racun.KupacId)
                            .Distinct()
                            .Count()
                    })
                    .ToList();

                var rezultat = podaci.Select(p => new GrafProizvodDTO(p.NazivIgre, p.BrojKupaca)).ToList();
                return Ok(rezultat);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}