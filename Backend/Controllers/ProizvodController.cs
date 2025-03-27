﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿using AutoMapper;
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
    /// <summary>
    /// Kontroler za upravljanje proizvodima.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class ProizvodController : BackendController
    {
        /// <summary>
        /// Konstruktor za ProizvodController.
        /// </summary>
        /// <param name="context">Kontekst baze podataka.</param>
        /// <param name="mapper">Mapper za mapiranje između modela i DTO-a.</param>
        public ProizvodController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

        /// <summary>
        /// Dohvaća sve proizvode.
        /// </summary>
        /// <returns>Lista proizvoda.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<ProizvodDTORead>), 200)]
        public IActionResult Get()
        {
            try
            {
                var proizvodi = _context.Proizvodi.ToList();
                var proizvodiDTO = _mapper.Map<List<ProizvodDTORead>>(proizvodi);
                return Ok(proizvodiDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dohvaća proizvod prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra proizvoda.</param>
        /// <returns>Proizvod s traženom šifrom.</returns>
        [HttpGet("{sifra:int}")]
        [ProducesResponseType(typeof(ProizvodDTORead), 200)]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var proizvod = _context.Proizvodi.Find(sifra);
                if (proizvod == null)
                {
                    return NotFound(new { poruka = $"Proizvod s šifrom {sifra} ne postoji" });
                }
                var proizvodDTO = _mapper.Map<ProizvodDTORead>(proizvod);
                return Ok(proizvodDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dodaje novi proizvod.
        /// </summary>
        /// <param name="proizvodDTO">Podaci o proizvodu.</param>
        /// <returns>Dodani proizvod.</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post([FromBody] ProizvodDTOInsertUpdate proizvodDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var proizvod = _mapper.Map<Proizvod>(proizvodDTO);
                _context.Proizvodi.Add(proizvod);
                _context.SaveChanges();
                var proizvodReadDTO = _mapper.Map<ProizvodDTORead>(proizvod);
                return StatusCode(StatusCodes.Status201Created, proizvodReadDTO);
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
        /// Ažurira postojeći proizvod.
        /// </summary>
        /// <param name="sifra">Šifra proizvoda.</param>
        /// <param name="proizvodDTO">Podaci o proizvodu.</param>
        /// <returns>Ažurirani proizvod.</returns>
        [HttpPut("{sifra:int}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put(int sifra, ProizvodDTOInsertUpdate proizvodDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var proizvodBaza = _context.Proizvodi.Find(sifra);
                if (proizvodBaza == null)
                {
                    return NotFound(new { poruka = $"Proizvod s šifrom {sifra} ne postoji" });
                }

                _mapper.Map(proizvodDTO, proizvodBaza);

                _context.Proizvodi.Update(proizvodBaza);
                _context.SaveChanges();
                var proizvodReadDTO = _mapper.Map<ProizvodDTORead>(proizvodBaza);
                return Ok(proizvodReadDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Briše proizvod.
        /// </summary>
        /// <param name="sifra">Šifra proizvoda.</param>
        /// <returns>Status brisanja.</returns>
        [HttpDelete("{sifra:int}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var proizvod = _context.Proizvodi.Find(sifra);
                if (proizvod == null)
                {
                    return NotFound(new { poruka = $"Proizvod s šifrom {sifra} ne postoji" });
                }
                _context.Proizvodi.Remove(proizvod);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dohvaća podatke za graf - ukupan broj prodanih primjeraka po proizvodu.
        /// </summary>
        /// <returns>Podaci za graf.</returns>
        [HttpGet]
        [Route("graf")]
        public IActionResult DohvatiPodatkeZaGraf()
        {
            try
            {
                var podaci = _context.Proizvodi
                    .Select(p => new
                    {
                        p.Sifra,
                        p.NazivIgre,
                        BrojProdanihPrimjeraka = _context.Stavke
                            .Where(s => s.ProizvodId == p.Sifra)
                            .Sum(s => s.Kolicina)
                    })
                    .ToList();

                var rezultat = podaci.Select(p => new GrafProizvodDTO(p.NazivIgre, p.BrojProdanihPrimjeraka)).ToList();
                return Ok(rezultat);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Postavlja sliku za proizvod.
        /// </summary>
        /// <param name="sifra">Šifra proizvoda.</param>
        /// <param name="slika">Podaci o slici.</param>
        /// <returns>Status postavljanja slike.</returns>
        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        [Authorize(Roles = "Admin")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slika)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra mora biti veća od nula (0)");
            }
            if (slika.Base64 == null || slika.Base64?.Length == 0)
            {
                return BadRequest("Slika nije postavljena");
            }
            var p = _context.Proizvodi.Find(sifra);
            if (p == null)
            {
                return BadRequest("Ne postoji proizvod s šifrom " + sifra + ".");
            }
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "proizvodi");

                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }
                var putanja = Path.Combine(dir + ds + sifra + ".png");
                System.IO.File.WriteAllBytes(putanja, Convert.FromBase64String(slika.Base64!));
                return Ok("Uspješno pohranjena slika");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
