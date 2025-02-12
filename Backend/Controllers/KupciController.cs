using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]

    public class KupciController : ControllerBase
    {
        private readonly BackendContext _context;

        public KupciController(BackendContext context)
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
                return BadRequest(e);
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
                var smjer = _context.Kupci.Find(sifra);
                if (smjer == null)
                {
                    return NotFound(new { poruka = $"Smjer s šifrom {sifra} ne postoji" });
                }
                return Ok(smjer);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult Post(Kupac kupac) // Change parameter type to Kupac
        {
            try
            {
                _context.Kupci.Add(kupac);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, kupac);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, Kupac smjer)
        {
            try
            {

                var kupciBaza = _context.Kupci.Find(sifra);
                if (kupciBaza == null)
                {
                    return NotFound(new { poruka = $"Kupac s šifrom {sifra} ne postoji" });
                }

                // rucni mapping - kasnije automatika
                kupciBaza.Ime = smjer.Ime;
                kupciBaza.Prezime = smjer.Prezime;
                kupciBaza.Ulica = smjer.Ulica;
                kupciBaza.Mjesto = smjer.Mjesto;

                _context.Kupci.Update(kupciBaza);
                _context.SaveChanges();
                return Ok(kupciBaza);
            }
            catch (Exception e)
            {
                return BadRequest(e);
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
                var smjer = _context.Kupci.Find(sifra);
                if (smjer == null)
                {
                    return NotFound(new { poruka = $"Kupci s šifrom {sifra} ne postoje" });
                }
                _context.Kupci.Remove(smjer);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }

        }
    }
}
