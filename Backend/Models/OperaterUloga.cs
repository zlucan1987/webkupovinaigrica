using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Model uloge operatera u sustavu
    /// </summary>
    public class OperaterUloga : Entitet
    {
        /// <summary>
        /// Naziv uloge
        /// </summary>
        [Required]
        public string Naziv { get; set; } = string.Empty;
        
        /// <summary>
        /// Opis uloge
        /// </summary>
        public string? Opis { get; set; }
        
        /// <summary>
        /// Veza s operaterima (many-to-many)
        /// </summary>
        public ICollection<OperaterOperaterUloga> OperaterOperaterUloge { get; set; } = new List<OperaterOperaterUloga>();
    }
}
