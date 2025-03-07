using AutoMapper;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
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
    }
}