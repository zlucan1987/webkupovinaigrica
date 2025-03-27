using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za promjenu lozinke.
    /// </summary>
    public class PasswordChangeDTO
    {
        /// <summary>
        /// Trenutna lozinka operatera
        /// </summary>
        [Required(ErrorMessage = "Trenutna lozinka je obavezna.")]
        public string TrenutnaLozinka { get; set; } = string.Empty;
        
        /// <summary>
        /// Nova lozinka operatera
        /// </summary>
        [Required(ErrorMessage = "Nova lozinka je obavezna.")]
        [MinLength(6, ErrorMessage = "Nova lozinka mora imati najmanje 6 znakova.")]
        public string NovaLozinka { get; set; } = string.Empty;
    }
}
