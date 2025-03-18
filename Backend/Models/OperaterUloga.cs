using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class OperaterUloga : Entitet
    {
        [Required]
        public string Naziv { get; set; } = string.Empty;
        
        public string? Opis { get; set; }
        
        // Veza s operaterima (many-to-many)
        public ICollection<OperaterOperaterUloga> OperaterOperaterUloge { get; set; } = new List<OperaterOperaterUloga>();
    }
}
