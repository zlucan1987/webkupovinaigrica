using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za ažuriranje nadimka operatera.
    /// </summary>
    public class NicknameUpdateDTO
    {
        /// <summary>
        /// Novi nadimak operatera
        /// </summary>
        [Required(ErrorMessage = "Nadimak je obavezan.")]
        [MinLength(2, ErrorMessage = "Nadimak mora imati najmanje 2 znaka.")]
        [MaxLength(50, ErrorMessage = "Nadimak može imati najviše 50 znakova.")]
        public string Nickname { get; set; } = string.Empty;
        
        /// <summary>
        /// Označava treba li zaključati nadimak (korisnik ga ne može mijenjati)
        /// </summary>
        public bool Locked { get; set; } = false;
    }
}
