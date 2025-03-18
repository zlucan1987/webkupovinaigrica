using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class OperaterOperaterUloga : Entitet
    {
        [Required]
        public int OperaterId { get; set; }
        
        [ForeignKey(nameof(OperaterId))]
        public Operater? Operater { get; set; }
        
        [Required]
        public int OperaterUlogaId { get; set; }
        
        [ForeignKey(nameof(OperaterUlogaId))]
        public OperaterUloga? OperaterUloga { get; set; }
    }
}
