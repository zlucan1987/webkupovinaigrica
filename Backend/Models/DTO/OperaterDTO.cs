using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) za operatera.
    /// </summary>
    /// <param name="KorisnickoIme">Korisničko ime operatera</param>
    /// <param name="Password">Lozinka operatera</param>
    public record OperaterDTO(
        [Required(ErrorMessage = "Korisničko ime je obavezno.")]
        string KorisnickoIme,
        
        [Required(ErrorMessage = "Lozinka je obavezna.")]
        string Password);
}
