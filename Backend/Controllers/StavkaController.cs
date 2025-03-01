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
    public class StavkaController : BackendController
    {
        public StavkaController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<StavkaDTORead>), 200)]
        public IActionResult Get()
        {
            try
            {
                var stavke = _context.Stavke.ToList();
                var stavkeDTO = _mapper.Map<List<StavkaDTORead>>(stavke);
                return Ok(stavkeDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{sifra:int}")]
        [ProducesResponseType(typeof(StavkaDTORead), 200)]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var stavka = _context.Stavke.Find(sifra);
                if (stavka == null)
                {
                    return NotFound(new { poruka = $"Stavka s šifrom {sifra} ne postoji" });
                }
                var stavkaDTO = _mapper.Map<StavkaDTORead>(stavka);
                return Ok(stavkaDTO);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] StavkaDTOInsertUpdate stavkaDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stavka = _mapper.Map<Stavka>(stavkaDTO);
                _context.Stavke.Add(stavka);
                _context.SaveChanges();
                var stavkaReadDTO = _mapper.Map<StavkaDTORead>(stavka);
                return StatusCode(StatusCodes.Status201Created, stavkaReadDTO);
            }
            catch (DbUpdateException dbEx)
            {
                return BadRequest("Greška pri upisu u bazu podataka.");
            }
            catch (Exception ex)
            {
                return BadRequest("Opća greška.");
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, StavkaDTOInsertUpdate stavkaDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var stavkaBaza = _context.Stavke.Find(sifra);
                if (stavkaBaza == null)
                {
                    return NotFound(new { poruka = $"Stavka s šifrom {sifra} ne postoji" });
                }

                _mapper.Map(stavkaDTO, stavkaBaza);

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

        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra <= 0)
            {
                return StatusCode(StatusCodes.Status404NotFound, new { poruka = "Šifra mora biti pozitivan broj" });
            }
            try
            {
                var stavka = _context.Stavke.Find(sifra);
                if (stavka == null)
                {
                    return NotFound(new { poruka = $"Stavka s šifrom {sifra} ne postoji" });
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