using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Models
{
    public class Stavka: Entitet
    {

        public int racun { get; set; }
        public int proizvod { get; set; }
        public int kolicina { get; set; }
        public decimal cijena { get; set; }
        public DateTime datumkupnje { get; set; }

    }
}
