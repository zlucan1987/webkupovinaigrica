using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Racun : Entitet
    {
        public DateTime Datum { get; set; }

        [ForeignKey("kupac")] 
        public required Kupac Kupac{ get; set; } 
        public ICollection<Stavka>? Stavke { get; set; }
    }
}