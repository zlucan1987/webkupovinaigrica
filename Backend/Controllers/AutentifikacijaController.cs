using Backend.Data;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Controllers
{
    /// <summary>
    /// Kontroler za autentifikaciju i upravljanje korisnicima.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutentifikacijaController : ControllerBase
    {
        private readonly BackendContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AutentifikacijaController> _logger;

        /// <summary>
        /// Konstruktor za AutentifikacijaController.
        /// </summary>
        /// <param name="context">Kontekst baze podataka.</param>
        /// <param name="configuration">Konfiguracija aplikacije.</param>
        /// <param name="logger">Logger za bilježenje događaja.</param>
        public AutentifikacijaController(
            BackendContext context,
            IConfiguration configuration,
            ILogger<AutentifikacijaController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Prijava korisnika i generiranje JWT tokena.
        /// </summary>
        /// <param name="operaterDTO">Podaci za prijavu.</param>
        /// <returns>JWT token ako je prijava uspješna, inače 403 Forbidden.</returns>
        [HttpPost("Login")]
        public async Task<IActionResult> Login(OperaterDTO operaterDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var operater = await _context.Operateri
                .Include(o => o.OperaterOperaterUloge)
                .ThenInclude(oou => oou.OperaterUloga)
                .FirstOrDefaultAsync(o => o.KorisnickoIme == operaterDTO.KorisnickoIme);

            if (operater == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, ne mogu naći operatera");
            }

            try
            {
                var isValid = BCrypt.Net.BCrypt.Verify(operaterDTO.Password, operater.Lozinka);
                if (!isValid)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, lozinka ne odgovara");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška prilikom verifikacije lozinke");
                return StatusCode(StatusCodes.Status500InternalServerError, "Greška prilikom verifikacije lozinke");
            }

            // Dohvati uloge operatera
            var uloge = operater.OperaterOperaterUloge
                .Select(oou => oou.OperaterUloga?.Naziv)
                .Where(naziv => naziv != null)
                .ToList();

            // Ako korisnik nema uloge, dodaj mu osnovnu ulogu "User"
            if (uloge.Count == 0)
            {
                uloge.Add("User");
            }

            // Generiraj token
            var token = GenerateJwtToken(operater, uloge);

            return Ok(token);
        }

        /// <summary>
        /// Registracija novog korisnika.
        /// </summary>
        /// <param name="registerDTO">Podaci za registraciju.</param>
        /// <returns>Rezultat registracije.</returns>
        [HttpPost("Register")]
        public async Task<IActionResult> Register(OperaterRegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Provjeri postoji li već korisnik s istim korisničkim imenom
            var postojeciOperater = await _context.Operateri
                .FirstOrDefaultAsync(o => o.KorisnickoIme == registerDTO.KorisnickoIme);

            if (postojeciOperater != null)
            {
                return BadRequest("Korisničko ime već postoji");
            }

            // Kreiraj novog operatera
            var noviOperater = new Operater
            {
                KorisnickoIme = registerDTO.KorisnickoIme,
                Lozinka = BCrypt.Net.BCrypt.HashPassword(registerDTO.Lozinka),
                Ime = registerDTO.Ime,
                Prezime = registerDTO.Prezime,
                Aktivan = true
            };

            // Dodaj operatera u bazu
            await _context.Operateri.AddAsync(noviOperater);
            await _context.SaveChangesAsync();

            // Dohvati ili kreiraj ulogu "User"
            var userUloga = await _context.OperaterUloge
                .FirstOrDefaultAsync(ou => ou.Naziv == "User");

            if (userUloga == null)
            {
                userUloga = new OperaterUloga
                {
                    Naziv = "User",
                    Opis = "Standardna korisnička uloga"
                };
                await _context.OperaterUloge.AddAsync(userUloga);
                await _context.SaveChangesAsync();
            }

            // Dodaj vezu između operatera i uloge
            var operaterUloga = new OperaterOperaterUloga
            {
                OperaterId = noviOperater.Sifra,
                OperaterUlogaId = userUloga.Sifra
            };

            await _context.OperaterOperaterUloge.AddAsync(operaterUloga);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registracija uspješna" });
        }

        /// <summary>
        /// Dohvaća sve korisnike.
        /// </summary>
        /// <returns>Lista korisnika.</returns>
        [HttpGet("Users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OperaterReadDTO>>> GetUsers()
        {
            var operateri = await _context.Operateri
                .Include(o => o.OperaterOperaterUloge)
                .ThenInclude(oou => oou.OperaterUloga)
                .ToListAsync();

            var result = operateri.Select(o => new OperaterReadDTO
            {
                Id = o.Sifra,
                KorisnickoIme = o.KorisnickoIme,
                Ime = o.Ime,
                Prezime = o.Prezime,
                Aktivan = o.Aktivan,
                Uloge = o.OperaterOperaterUloge
                    .Select(oou => oou.OperaterUloga?.Naziv)
                    .Where(naziv => naziv != null)
                    .Select(naziv => naziv!)
                    .ToList()
            }).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Ažurira uloge korisnika.
        /// </summary>
        /// <param name="id">ID korisnika.</param>
        /// <param name="updateRolesDTO">Podaci za ažuriranje uloga.</param>
        /// <returns>Rezultat ažuriranja.</returns>
        [HttpPut("Users/{id}/Roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUserRoles(int id, OperaterUpdateRolesDTO updateRolesDTO)
        {
            if (id != updateRolesDTO.OperaterId)
            {
                return BadRequest("ID korisnika u URL-u i tijelu zahtjeva se ne podudaraju");
            }

            var operater = await _context.Operateri
                .Include(o => o.OperaterOperaterUloge)
                .FirstOrDefaultAsync(o => o.Sifra == id);

            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }

            // Ukloni sve postojeće veze s ulogama
            _context.OperaterOperaterUloge.RemoveRange(operater.OperaterOperaterUloge);
            await _context.SaveChangesAsync();

            // Dodaj nove uloge
            foreach (var ulogaNaziv in updateRolesDTO.Uloge)
            {
                // Dohvati ili kreiraj ulogu
                var uloga = await _context.OperaterUloge
                    .FirstOrDefaultAsync(ou => ou.Naziv == ulogaNaziv);

                if (uloga == null)
                {
                    uloga = new OperaterUloga
                    {
                        Naziv = ulogaNaziv,
                        Opis = $"Uloga {ulogaNaziv}"
                    };
                    await _context.OperaterUloge.AddAsync(uloga);
                    await _context.SaveChangesAsync();
                }

                // Dodaj vezu između operatera i uloge
                var operaterUloga = new OperaterOperaterUloga
                {
                    OperaterId = operater.Sifra,
                    OperaterUlogaId = uloga.Sifra
                };

                await _context.OperaterOperaterUloge.AddAsync(operaterUloga);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Uloge uspješno ažurirane" });
        }

        /// <summary>
        /// Generira JWT token za korisnika.
        /// </summary>
        /// <param name="operater">Operater za kojeg se generira token.</param>
        /// <param name="uloge">Uloge operatera.</param>
        /// <returns>JWT token.</returns>
        private string GenerateJwtToken(Operater operater, List<string> uloge)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, operater.KorisnickoIme ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, operater.Sifra.ToString())
            };

            // Dodaj uloge u claims
            foreach (var uloga in uloge)
            {
                claims.Add(new Claim(ClaimTypes.Role, uloga));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
