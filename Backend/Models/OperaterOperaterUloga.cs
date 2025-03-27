using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Model veze između operatera i uloge (many-to-many)
    /// </summary>
    public class OperaterOperaterUloga : Entitet
    {
        /// <summary>
        /// ID operatera
        /// </summary>
        [Required]
        public int OperaterId { get; set; }
        
        /// <summary>
        /// Referenca na operatera
        /// </summary>
        [ForeignKey(nameof(OperaterId))]
        public Operater? Operater { get; set; }
        
        /// <summary>
        /// ID uloge operatera
        /// </summary>
        [Required]
        public int OperaterUlogaId { get; set; }
        
        /// <summary>
        /// Referenca na ulogu operatera
        /// </summary>
        [ForeignKey(nameof(OperaterUlogaId))]
        public OperaterUloga? OperaterUloga { get; set; }
    }
}
