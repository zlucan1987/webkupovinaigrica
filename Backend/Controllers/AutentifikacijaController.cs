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
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     POST /api/v1/Autentifikacija/Login
        ///     {
        ///        "korisnickoIme": "admin@admin.com",
        ///        "password": "admin123"
        ///     }
        ///
        /// </remarks>
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
                .Select(naziv => naziv!) // Dodajemo ! operator za null-forgiving
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
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     POST /api/v1/Autentifikacija/Register
        ///     {
        ///        "korisnickoIme": "novi.korisnik@example.com",
        ///        "lozinka": "Lozinka1!",
        ///        "ime": "Novi",
        ///        "prezime": "Korisnik"
        ///     }
        ///
        /// </remarks>
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
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     GET /api/v1/Autentifikacija/Users
        ///
        /// </remarks>
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
                Nickname = o.Nickname,
                NicknameLocked = o.NicknameLocked,
                Uloge = o.OperaterOperaterUloge
                    .Select(oou => oou.OperaterUloga?.Naziv)
                    .Where(naziv => naziv != null)
                    .Select(naziv => naziv!)
                    .ToList()
            }).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Resetira lozinku admin korisnika ili kreira novog admin korisnika ako ne postoji.
        /// </summary>
        /// <returns>Rezultat resetiranja lozinke ili kreiranja admin korisnika.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     POST /api/v1/Autentifikacija/ResetAdminPassword
        ///
        /// </remarks>
        [HttpPost("ResetAdminPassword")]
        public async Task<IActionResult> ResetAdminPassword()
        {
            try
            {
                // Dohvati admin korisnika
                var admin = await _context.Operateri
                    .FirstOrDefaultAsync(o => o.KorisnickoIme == "admin@admin.com");

                if (admin == null)
                {
                    // Admin korisnik ne postoji, kreiraj ga
                    admin = new Operater
                    {
                        KorisnickoIme = "admin@admin.com",
                        Lozinka = "$2a$12$evbGgCZYJaC9QikdcBs8Te5G8XJJw4AhBuLmCxsOI80PeeFiQt2B6", // admin123
                        Ime = "Admin",
                        Prezime = "Admin",
                        Aktivan = true
                    };

                    // Dodaj admin korisnika u bazu
                    await _context.Operateri.AddAsync(admin);
                    await _context.SaveChangesAsync();

                    // Dohvati ili kreiraj Admin ulogu
                    var adminUloga = await _context.OperaterUloge
                        .FirstOrDefaultAsync(ou => ou.Naziv == "Admin");

                    if (adminUloga == null)
                    {
                        adminUloga = new OperaterUloga
                        {
                            Naziv = "Admin",
                            Opis = "Administratorska uloga s punim pravima"
                        };
                        await _context.OperaterUloge.AddAsync(adminUloga);
                        await _context.SaveChangesAsync();
                    }

                    // Dodaj vezu između admin korisnika i Admin uloge
                    var operaterUloga = new OperaterOperaterUloga
                    {
                        OperaterId = admin.Sifra,
                        OperaterUlogaId = adminUloga.Sifra
                    };

                    await _context.OperaterOperaterUloge.AddAsync(operaterUloga);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Admin korisnik uspješno kreiran s lozinkom 'admin123'" });
                }
                else
                {
                    // Admin korisnik postoji, resetiraj lozinku
                    admin.Lozinka = "$2a$12$evbGgCZYJaC9QikdcBs8Te5G8XJJw4AhBuLmCxsOI80PeeFiQt2B6"; // admin123

                    // Spremi promjene
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Admin lozinka uspješno resetirana na 'admin123'" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška prilikom resetiranja admin lozinke ili kreiranja admin korisnika");
                return StatusCode(StatusCodes.Status500InternalServerError, "Greška prilikom resetiranja admin lozinke ili kreiranja admin korisnika");
            }
        }

        /// <summary>
        /// Ažurira uloge korisnika.
        /// </summary>
        /// <param name="id">ID korisnika.</param>
        /// <param name="updateRolesDTO">Podaci za ažuriranje uloga.</param>
        /// <returns>Rezultat ažuriranja.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     PUT /api/v1/Autentifikacija/Users/1/Roles
        ///     {
        ///        "operaterId": 1,
        ///        "uloge": ["User", "Admin"]
        ///     }
        ///
        /// </remarks>
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
        /// Dohvaća detalje o korisniku.
        /// </summary>
        /// <param name="id">ID korisnika.</param>
        /// <returns>Detalji o korisniku.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     GET /api/v1/Autentifikacija/Users/1/Details
        ///
        /// </remarks>
        [HttpGet("Users/{id}/Details")]
        [Authorize]
        public async Task<ActionResult<OperaterDetailsDTO>> GetUserDetails(int id)
        {
            // Provjeri ima li korisnik pravo pristupa
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            
            // Samo admin može vidjeti detalje drugih korisnika
            if (id != currentUserId && !isAdmin)
            {
                return Forbid("Nemate pravo pristupa ovim podacima");
            }
            
            var operater = await _context.Operateri
                .Include(o => o.OperaterOperaterUloge)
                .ThenInclude(oou => oou.OperaterUloga)
                .FirstOrDefaultAsync(o => o.Sifra == id);
                
            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }
            
            var result = new OperaterDetailsDTO
            {
                Id = operater.Sifra,
                KorisnickoIme = operater.KorisnickoIme,
                Ime = operater.Ime,
                Prezime = operater.Prezime,
                Nickname = operater.Nickname,
                NicknameLocked = operater.NicknameLocked,
                Aktivan = operater.Aktivan,
                ZadnjaPromjenaLozinke = operater.ZadnjaPromjenaLozinke,
                DatumKreiranja = operater.DatumKreiranja ?? DateTime.UtcNow,
                Uloge = operater.OperaterOperaterUloge
                    .Select(oou => oou.OperaterUloga?.Naziv)
                    .Where(naziv => naziv != null)
                    .Select(naziv => naziv!)
                    .ToList()
            };
            
            return Ok(result);
        }
        
        /// <summary>
        /// Ažurira podatke o korisniku.
        /// </summary>
        /// <param name="id">ID korisnika.</param>
        /// <param name="updateDTO">Podaci za ažuriranje.</param>
        /// <returns>Rezultat ažuriranja.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     PUT /api/v1/Autentifikacija/Users/1
        ///     {
        ///        "ime": "Ažurirano",
        ///        "prezime": "Prezime",
        ///        "korisnickoIme": "azurirano.prezime@example.com"
        ///     }
        ///
        /// </remarks>
        [HttpPut("Users/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(int id, OperaterUpdateDTO updateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Provjeri ima li korisnik pravo pristupa
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            
            // Samo admin može ažurirati podatke drugih korisnika
            if (id != currentUserId && !isAdmin)
            {
                return Forbid("Nemate pravo pristupa ovim podacima");
            }
            
            var operater = await _context.Operateri.FindAsync(id);
            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }
            
            // Provjeri postoji li već korisnik s istim korisničkim imenom
            if (updateDTO.KorisnickoIme != operater.KorisnickoIme)
            {
                var postojeciOperater = await _context.Operateri
                    .FirstOrDefaultAsync(o => o.KorisnickoIme == updateDTO.KorisnickoIme);
                
                if (postojeciOperater != null)
                {
                    return BadRequest("Korisničko ime već postoji");
                }
            }
            
            // Ažuriraj podatke
            operater.Ime = updateDTO.Ime;
            operater.Prezime = updateDTO.Prezime;
            operater.KorisnickoIme = updateDTO.KorisnickoIme;
            
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Podaci uspješno ažurirani" });
        }
        
        /// <summary>
        /// Promjena lozinke korisnika.
        /// </summary>
        /// <param name="passwordDTO">Podaci za promjenu lozinke.</param>
        /// <returns>Rezultat promjene lozinke.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     POST /api/v1/Autentifikacija/ChangePassword
        ///     {
        ///        "trenutnaLozinka": "StariPassword1!",
        ///        "novaLozinka": "NoviPassword2@"
        ///     }
        ///
        /// </remarks>
        [HttpPost("ChangePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(PasswordChangeDTO passwordDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Dohvati trenutnog korisnika
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var operater = await _context.Operateri.FindAsync(currentUserId);
            
            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }
            
            // Provjeri trenutnu lozinku
            try
            {
                var isValid = BCrypt.Net.BCrypt.Verify(passwordDTO.TrenutnaLozinka, operater.Lozinka);
                if (!isValid)
                {
                    return BadRequest("Trenutna lozinka nije ispravna");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška prilikom verifikacije lozinke");
                return StatusCode(StatusCodes.Status500InternalServerError, "Greška prilikom verifikacije lozinke");
            }
            
            // Provjeri složenost nove lozinke
            if (!IsPasswordStrong(passwordDTO.NovaLozinka))
            {
                return BadRequest("Nova lozinka nije dovoljno jaka. Lozinka mora sadržavati najmanje 6 znakova, jedno veliko slovo, jedan broj i jedan specijalni znak.");
            }
            
            // Ažuriraj lozinku
            operater.Lozinka = BCrypt.Net.BCrypt.HashPassword(passwordDTO.NovaLozinka);
            operater.ZadnjaPromjenaLozinke = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Lozinka uspješno promijenjena" });
        }
        
        /// <summary>
        /// Briše korisnika iz sustava.
        /// </summary>
        /// <param name="id">ID korisnika kojeg treba obrisati.</param>
        /// <returns>Rezultat brisanja.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     DELETE /api/v1/Autentifikacija/Users/1
        ///
        /// </remarks>
        [HttpDelete("Users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Provjeri postoji li korisnik
            var operater = await _context.Operateri
                .Include(o => o.OperaterOperaterUloge)
                .FirstOrDefaultAsync(o => o.Sifra == id);
                
            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }
            
            // Provjeri ima li korisnik Admin ulogu
            var isAdmin = operater.OperaterOperaterUloge
                .Any(oou => oou.OperaterUloga?.Naziv == "Admin");
                
            if (isAdmin)
            {
                return BadRequest("Nije moguće obrisati korisnika s administratorskim pravima. Prvo uklonite administratorska prava.");
            }
            
            // Ukloni sve veze s ulogama
            _context.OperaterOperaterUloge.RemoveRange(operater.OperaterOperaterUloge);
            
            // Obriši korisnika
            _context.Operateri.Remove(operater);
            
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Korisnik uspješno obrisan" });
        }
        
        /// <summary>
        /// Ažurira nadimak korisnika.
        /// </summary>
        /// <param name="id">ID korisnika.</param>
        /// <param name="nicknameDTO">Podaci za ažuriranje nadimka.</param>
        /// <returns>Rezultat ažuriranja.</returns>
        /// <remarks>
        /// Primjer zahtjeva:
        ///
        ///     PUT /api/v1/Autentifikacija/Users/1/Nickname
        ///     {
        ///        "nickname": "CoolGamer123",
        ///        "locked": true
        ///     }
        ///
        /// </remarks>
        [HttpPut("Users/{id}/Nickname")]
        [Authorize]
        public async Task<IActionResult> UpdateNickname(int id, NicknameUpdateDTO nicknameDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Provjeri ima li korisnik pravo pristupa
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");
            
            var operater = await _context.Operateri.FindAsync(id);
            if (operater == null)
            {
                return NotFound("Korisnik nije pronađen");
            }
            
            // Provjeri je li nadimak zaključan
            if (operater.NicknameLocked && !isAdmin)
            {
                return BadRequest("Nadimak je zaključan i ne može se promijeniti");
            }
            
            // Samo admin može ažurirati nadimak drugih korisnika ili zaključati/otključati nadimak
            if (id != currentUserId && !isAdmin)
            {
                return Forbid("Nemate pravo pristupa ovim podacima");
            }
            
            // Ažuriraj nadimak
            operater.Nickname = nicknameDTO.Nickname;
            
            // Samo admin može zaključati/otključati nadimak
            if (isAdmin)
            {
                operater.NicknameLocked = nicknameDTO.Locked;
            }
            
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Nadimak uspješno ažuriran" });
        }
        
        /// <summary>
        /// Provjera složenosti lozinke.
        /// </summary>
        /// <param name="password">Lozinka za provjeru.</param>
        /// <returns>True ako je lozinka dovoljno jaka, inače false.</returns>
        private bool IsPasswordStrong(string password)
        {
            // Minimalno 6 znakova
            if (password.Length < 6)
                return false;
                
            // Barem jedno veliko slovo
            if (!password.Any(char.IsUpper))
                return false;
                
            // Barem jedan broj
            if (!password.Any(char.IsDigit))
                return false;
                
            // Barem jedan specijalni znak
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                return false;
                
            return true;
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
                new Claim(ClaimTypes.NameIdentifier, operater.Sifra.ToString()),
                new Claim("ime", operater.Ime ?? string.Empty),
                new Claim("prezime", operater.Prezime ?? string.Empty),
                new Claim("nickname", operater.Nickname ?? string.Empty),
                new Claim("email", operater.KorisnickoIme ?? string.Empty),
                new Claim("sub", operater.KorisnickoIme ?? string.Empty),
                new Claim("nbf", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
            };

            // Dodaj uloge u claims
            foreach (var uloga in uloge)
            {
                claims.Add(new Claim(ClaimTypes.Role, uloga));
                // Dodaj i kao jednostavnu "role" claim za lakši pristup u frontendu
                claims.Add(new Claim("role", uloga));
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
