﻿using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class KupacController : ControllerBase
    {
        private readonly BackendContext _context;

        public KupacController(BackendContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Kupci);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("{sifra:int}")]
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
                return Ok(kupac);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] Kupac kupac)
        {
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState)
                {
                    Console.WriteLine($"Validacijska greška: {error.Key} - {error.Value.Errors.FirstOrDefault()?.ErrorMessage}");
                }
                return BadRequest(ModelState);
            }
            try
            {
                _context.Kupci.Add(kupac);
                Console.WriteLine($"Kupac za upis: {System.Text.Json.JsonSerializer.Serialize(kupac)}");
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, kupac);
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"Greška pri upisu u bazu: {dbEx.ToString()}");
                return BadRequest("Greška pri upisu u bazu podataka.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Opća greška: {ex.Message}");
                return BadRequest("Opća greška.");
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Kupac kupac)
        {
            try
            {
                var kupciBaza = _context.Kupci.Find(sifra);
                if (kupciBaza == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {sifra} ne postoji" });
                }

                kupciBaza.Ime = kupac.Ime;
                kupciBaza.Prezime = kupac.Prezime;
                kupciBaza.Ulica = kupac.Ulica;
                kupciBaza.Mjesto = kupac.Mjesto;

                _context.Kupci.Update(kupciBaza);
                _context.SaveChanges();
                return Ok(kupciBaza);
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