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
    public class ProizvodController : BackendController
    {
        public ProizvodController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

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

        [HttpPost]
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

        [HttpDelete("{sifra:int}")]
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
    }
}