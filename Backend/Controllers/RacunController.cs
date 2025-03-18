using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class RacunController : BackendController
    {
        public RacunController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

        /// <summary>
        /// Dohvaća sve račune.
        /// </summary>
        /// <returns>Lista računa.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<RacunDTORead>), 200)]
        public IActionResult Get()
        {
            try
            {
                var racuni = _context.Racuni.Include(r => r.Kupac).ToList();
                var racuniDTO = _mapper.Map<List<RacunDTORead>>(racuni);
                return Ok(racuniDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dohvaća račun prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra računa.</param>
        /// <returns>Račun s traženom šifrom.</returns>
        [HttpGet("{sifra:int}")]
        [ProducesResponseType(typeof(RacunDTORead), 200)]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var racun = _context.Racuni.Include(r => r.Kupac).FirstOrDefault(r => r.Sifra == sifra);
                if (racun == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifra} ne postoji" });
                }
                var racunDTO = _mapper.Map<RacunDTORead>(racun);
                return Ok(racunDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dodaje novi račun.
        /// </summary>
        /// <param name="racunDTO">Podaci o računu.</param>
        /// <returns>Dodani račun.</returns>
        [HttpPost]
        public IActionResult Post([FromBody] RacunDTOInsertUpdate racunDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var racun = _mapper.Map<Racun>(racunDTO);

                // Dohvati Kupac iz baze podataka
                var kupac = _context.Kupci.Find(racunDTO.KupacSifra);
                if (kupac == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {racunDTO.KupacSifra} ne postoji" });
                }
                racun.Kupac = kupac; // Postavi Kupac na Racun entitet

                _context.Racuni.Add(racun);
                _context.SaveChanges();
                var racunReadDTO = _mapper.Map<RacunDTORead>(racun);
                return StatusCode(StatusCodes.Status201Created, racunReadDTO);
            }
            catch (DbUpdateException)
            {
                return BadRequest("Greška pri upisu u bazu podataka.");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Ažurira postojeći račun.
        /// </summary>
        /// <param name="sifra">Šifra računa.</param>
        /// <param name="racunDTO">Podaci o računu.</param>
        /// <returns>Ažurirani račun.</returns>
        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, RacunDTOInsertUpdate racunDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var racunBaza = _context.Racuni.Find(sifra);
                if (racunBaza == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifra} ne postoji" });
                }

                var kupac = _context.Kupci.Find(racunDTO.KupacSifra);

                if (kupac == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {racunDTO.KupacSifra} ne postoji" });
                }

                _mapper.Map(racunDTO, racunBaza);
                racunBaza.Kupac = kupac;
                _context.Racuni.Update(racunBaza);
                _context.SaveChanges();
                var racunReadDTO = _mapper.Map<RacunDTORead>(racunBaza);
                return Ok(racunReadDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Briše račun.
        /// </summary>
        /// <param name="sifra">Šifra računa.</param>
        /// <returns>Status brisanja.</returns>
        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var racun = _context.Racuni.Find(sifra);
                if (racun == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifra} ne postoji" });
                }
                _context.Racuni.Remove(racun);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dohvaća stavke računa.
        /// </summary>
        /// <param name="sifraRacuna">Šifra računa.</param>
        /// <returns>Lista stavki računa.</returns>
        [HttpGet]
        [Route("{sifraRacuna:int}/stavke")]
        public ActionResult<List<StavkaDTORead>> GetStavkeRacuna(int sifraRacuna)
        {
            try
            {
                var lista = _context.Stavke
                            .Include(s => s.Proizvod)
                            .Include(s => s.Racun)
                            .Where(s => s.Racun.Sifra == sifraRacuna).ToList();
             
                return Ok(
                    _mapper.Map<List<StavkaDTORead>>(
                        lista
                    )
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dodaje stavku na račun.
        /// </summary>
        /// <param name="sifraRacuna">Šifra računa.</param>
        /// <param name="stavkaDTO">Podaci o stavci.</param>
        /// <returns>Dodana stavka.</returns>
        [HttpPost("{sifraRacuna:int}/stavke")]
        public IActionResult DodajStavku(int sifraRacuna, [FromBody] StavkaDTOInsert stavkaDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var racun = _context.Racuni.Find(sifraRacuna);
                if (racun == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifraRacuna} ne postoji" });
                }

                var proizvod = _context.Proizvodi.Find(stavkaDTO.ProizvodSifra);
                if (proizvod == null)
                {
                    return NotFound(new { poruka = $"Proizvod s šifrom {stavkaDTO.ProizvodSifra} ne postoji" });
                }

                var stavka = _mapper.Map<Stavka>(stavkaDTO);
                stavka.Racun = racun;
                stavka.Proizvod = proizvod;

                _context.Stavke.Add(stavka);
                _context.SaveChanges();

                var stavkaReadDTO = _mapper.Map<StavkaDTORead>(stavka);
                return StatusCode(StatusCodes.Status201Created, stavkaReadDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Ažurira stavku na računu.
        /// </summary>
        /// <param name="sifraRacuna">Šifra računa.</param>
        /// <param name="sifraStavke">Šifra stavke.</param>
        /// <param name="stavkaDTO">Podaci o stavci.</param>
        /// <returns>Ažurirana stavka.</returns>
        [HttpPut("{sifraRacuna:int}/stavke/{sifraStavke:int}")]
        public IActionResult IzmijeniStavku(int sifraRacuna, int sifraStavke, [FromBody] StavkaDTOUpdate stavkaDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var racun = _context.Racuni.Find(sifraRacuna);
                if (racun == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifraRacuna} ne postoji" });
                }

                var stavkaBaza = _context.Stavke.FirstOrDefault(s => s.Racun.Sifra == sifraRacuna && s.Sifra == sifraStavke);
                if (stavkaBaza == null)
                {
                    return NotFound(new { poruka = $"Stavka s šifrom {sifraStavke} na računu {sifraRacuna} ne postoji" });
                }

                var proizvod = _context.Proizvodi.Find(stavkaDTO.ProizvodSifra);
                if (proizvod == null)
                {
                    return NotFound(new { poruka = $"Proizvod s šifrom {stavkaDTO.ProizvodSifra} ne postoji" });
                }

                // Dohvati Racun
                var racunStavka = _context.Racuni.Find(sifraRacuna);
                if (racunStavka == null)
                {
                    return NotFound(new { poruka = $"Račun s šifrom {sifraRacuna} ne postoji" });
                }

                _mapper.Map(stavkaDTO, stavkaBaza);
                stavkaBaza.Proizvod = proizvod;
                stavkaBaza.Racun = racunStavka;
                stavkaBaza.Sifra = sifraStavke;

                _context.Stavke.Update(stavkaBaza);
                _context.SaveChanges();

                var stavkaReadDTO = _mapper.Map<StavkaDTORead>(stavkaBaza);
                return Ok(stavkaReadDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Briše stavku s računa.
        /// </summary>
        /// <param name="sifraRacuna">Šifra računa.</param>
        /// <param name="sifraStavke">Šifra stavke.</param>
        /// <returns>Status brisanja.</returns>
        [HttpDelete("{sifraRacuna:int}/stavke/{sifraStavke:int}")]
        public IActionResult ObrisiStavku(int sifraRacuna, int sifraStavke)
        {
            try
            {
                var stavka = _context.Stavke.FirstOrDefault(s => s.Racun.Sifra == sifraRacuna && s.Sifra == sifraStavke);
                if (stavka == null)
                {
                    return NotFound(new { poruka = $"Stavka s šifrom {sifraStavke} na računu {sifraRacuna} ne postoji" });
                }

                _context.Stavke.Remove(stavka);
                _context.SaveChanges();

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
