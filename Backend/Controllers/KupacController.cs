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
    public class KupacController : BackendController
    {
        public KupacController(BackendContext context, IMapper mapper) : base(context, mapper)
        {
        }

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
    }
}