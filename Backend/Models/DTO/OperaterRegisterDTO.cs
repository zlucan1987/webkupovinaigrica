using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za registraciju novog operatera.
    /// </summary>
    public class OperaterRegisterDTO
    {
        /// <summary>
        /// Korisničko ime operatera
        /// </summary>
        [Required(ErrorMessage = "Korisničko ime je obavezno.")]
        [EmailAddress(ErrorMessage = "Korisničko ime mora biti valjana email adresa.")]
        public string KorisnickoIme { get; set; } = string.Empty;
        
        /// <summary>
        /// Lozinka operatera
        /// </summary>
        [Required(ErrorMessage = "Lozinka je obavezna.")]
        [MinLength(6, ErrorMessage = "Lozinka mora imati najmanje 6 znakova.")]
        public string Lozinka { get; set; } = string.Empty;
        
        /// <summary>
        /// Ime operatera
        /// </summary>
        [Required(ErrorMessage = "Ime je obavezno.")]
        public string Ime { get; set; } = string.Empty;
        
        /// <summary>
        /// Prezime operatera
        /// </summary>
        [Required(ErrorMessage = "Prezime je obavezno.")]
        public string Prezime { get; set; } = string.Empty;
    }
}
