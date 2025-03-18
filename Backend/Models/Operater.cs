using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Operater : Entitet
    {
        [Required]
        public string? KorisnickoIme { get; set; } 

        [Required]
        public string? Lozinka { get; set; }

        public string? Ime { get; set; }

        public string? Prezime { get; set; }

        public bool Aktivan { get; set; } = true;
        
        // Veza s ulogama (many-to-many)
        public ICollection<OperaterOperaterUloga> OperaterOperaterUloge { get; set; } = new List<OperaterOperaterUloga>();
    }
}
