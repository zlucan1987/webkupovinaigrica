using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za čitanje podataka o operateru.
    /// </summary>
    public class OperaterReadDTO
    {
        /// <summary>
        /// Šifra operatera
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Korisničko ime operatera
        /// </summary>
        public string? KorisnickoIme { get; set; }
        
        /// <summary>
        /// Ime operatera
        /// </summary>
        public string? Ime { get; set; }
        
        /// <summary>
        /// Prezime operatera
        /// </summary>
        public string? Prezime { get; set; }
        
        /// <summary>
        /// Status aktivnosti operatera
        /// </summary>
        public bool Aktivan { get; set; }
        
        /// <summary>
        /// Uloge operatera
        /// </summary>
        public List<string> Uloge { get; set; } = new List<string>();
    }
}
