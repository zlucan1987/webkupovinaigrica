using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Racun : Entitet
    {
        public DateTime Datum { get; set; }

        [ForeignKey("kupac")] // Promjena ovdje
        public required Kupac Kupac{ get; set; } // Dodano navigacijsko svojstvo
        public ICollection<Stavka>? Stavke { get; set; }
    }
}