﻿﻿﻿﻿using Backend.Data;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    /// <summary>
    /// Kontroler za autorizaciju korisnika.
    /// </summary>
    /// <remarks>
    /// Inicijalizira novu instancu klase <see cref="AutorizacijaController"/>.
    /// </remarks>
    /// <param name="context">Kontekst baze podataka.</param>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutorizacijaController(BackendContext context) : ControllerBase
    {
        /// <summary>
        /// Kontekst baze podataka
        /// </summary>
        private readonly BackendContext _context = context;

        /// <summary>
        /// Generira token za autorizaciju.
        /// </summary>
        /// <param name="operater">DTO objekt koji sadrži korisničko ime i lozinku operatera.</param>
        /// <returns>JWT token ako je autorizacija uspješna, inače vraća status 403.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        /// <code lang="json">
        /// {
        ///    "korisnickoIme": "edunova@edunova.hr",
        ///    "password": "edunova"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("token")]
        public IActionResult GenerirajToken(OperaterDTO operater)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var operBaza = _context.Operateri
                .Where(p => p.KorisnickoIme!.Equals(operater.KorisnickoIme))
                .FirstOrDefault();

            if (operBaza == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, ne mogu naći operatera");
            }

            // Dodajemo detaljnije informacije za dijagnostiku
            try
            {
                var isValid = BCrypt.Net.BCrypt.Verify(operater.Password, operBaza.Lozinka);
                if (!isValid)
                {
                    // Vraćamo više informacija za dijagnostiku
                    return StatusCode(StatusCodes.Status403Forbidden, 
                        $"Niste autorizirani, lozinka ne odgovara. Debug info: Password={operater.Password}, Hash={operBaza.Lozinka}");
                }
            }
            catch (Exception ex)
            {
                // Hvatamo i vraćamo bilo kakve iznimke koje se dogode tijekom verifikacije
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Greška prilikom verifikacije lozinke: {ex.Message}");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti");

            // Implementirani dio koda
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, operBaza.KorisnickoIme ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, operBaza.Sifra.ToString())  // "operBaza.Sifra.ToString()"
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(jwt);
        }
    }
}
