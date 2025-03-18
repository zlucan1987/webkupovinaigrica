using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za uloge operatera.
    /// </summary>
    public class OperaterUlogaDTO
    {
        /// <summary>
        /// Šifra uloge
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Naziv uloge
        /// </summary>
        [Required(ErrorMessage = "Naziv uloge je obavezan.")]
        public string Naziv { get; set; } = string.Empty;
        
        /// <summary>
        /// Opis uloge
        /// </summary>
        public string? Opis { get; set; }
    }
}
