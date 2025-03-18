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
    public class KupacController : BackendController
    {
        public KupacController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

        /// <summary>
        /// Dohvaća sve kupce.
        /// </summary>
        /// <returns>Lista kupaca.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<KupacDTORead>), 200)]
        public IActionResult Get()
        {
            try
            {
                var kupci = _context.Kupci.ToList();
                var kupciDTO = _mapper.Map<List<KupacDTORead>>(kupci);
                return Ok(kupciDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dohvaća kupca prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra kupca.</param>
        /// <returns>Kupac s traženom šifrom.</returns>
        [HttpGet("{sifra:int}")]
        [ProducesResponseType(typeof(KupacDTORead), 200)]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var kupac = _context.Kupci.Find(sifra);
                if (kupac == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {sifra} ne postoji" });
                }
                var kupacDTO = _mapper.Map<KupacDTORead>(kupac);
                return Ok(kupacDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Dodaje novog kupca.
        /// </summary>
        /// <param name="kupacDTO">Podaci o kupcu.</param>
        /// <returns>Dodani kupac.</returns>
        [HttpPost]
        public IActionResult Post([FromBody] KupacDTOInsertUpdate kupacDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var kupac = _mapper.Map<Kupac>(kupacDTO);
                _context.Kupci.Add(kupac);
                _context.SaveChanges();
                var kupacReadDTO = _mapper.Map<KupacDTORead>(kupac);
                return StatusCode(StatusCodes.Status201Created, kupacReadDTO);
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
        /// Ažurira postojećeg kupca.
        /// </summary>
        /// <param name="sifra">Šifra kupca.</param>
        /// <param name="kupacDTO">Podaci o kupcu.</param>
        /// <returns>Ažurirani kupac.</returns>
        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, KupacDTOInsertUpdate kupacDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var kupciBaza = _context.Kupci.Find(sifra);
                if (kupciBaza == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {sifra} ne postoji" });
                }

                _mapper.Map(kupacDTO, kupciBaza);

                _context.Kupci.Update(kupciBaza);
                _context.SaveChanges();
                var kupacReadDTO = _mapper.Map<KupacDTORead>(kupciBaza);
                return Ok(kupacReadDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Briše kupca.
        /// </summary>
        /// <param name="sifra">Šifra kupca.</param>
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
                var kupac = _context.Kupci.Find(sifra);
                if (kupac == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {sifra} ne postoji" });
                }
                _context.Kupci.Remove(kupac);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Generira kupce.
        /// </summary>
        /// <param name="broj">Broj kupaca za generiranje.</param>
        /// <returns>Status generiranja.</returns>
        [HttpGet]
        [Route("Generiraj/{broj:int}")]
        public IActionResult Generiraj(int broj)
        {
            try
            {
                for (int i = 0; i < broj; i++)
                {
                    var kupac = new Kupac()
                    {
                        Ime = Faker.Name.First(),
                        Prezime = Faker.Name.Last(),
                        Ulica = Faker.Address.StreetName(),
                        Mjesto = Faker.Address.City(),
                    };
                    _context.Kupci.Add(kupac);
                    _context.SaveChanges();
                }
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Traži kupce prema uvjetu.
        /// </summary>
        /// <param name="uvjet">Uvjet pretrage.</param>
        /// <returns>Lista kupaca.</returns>
        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<KupacDTORead>> TraziKupac(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Kupac> query = _context.Kupci;
                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }
                var kupci = query.ToList();
                return Ok(_mapper.Map<List<KupacDTORead>>(kupci));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        /// <summary>
        /// Traži kupce s paginacijom.
        /// </summary>
        /// <param name="stranica">Broj stranice.</param>
        /// <param name="uvjet">Uvjet pretrage.</param>
        /// <returns>Lista kupaca.</returns>
        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziKupacStranicenje(int stranica, string uvjet = "")
        {
            var poStranici = 4;
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Kupac> query = _context.Kupci;

                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }
                query = query.OrderBy(p => p.Prezime);
                var kupci = query.ToList();
                var filtriranaLista = kupci.Skip((poStranici * stranica) - poStranici).Take(poStranici);
                return Ok(_mapper.Map<List<KupacDTORead>>(filtriranaLista.ToList()));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
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
            var p = _context.Kupci.Find(sifra);
            if (p == null)
            {
                return BadRequest("Ne postoji kupac s šifrom " + sifra + ".");
            }
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "kupci");

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