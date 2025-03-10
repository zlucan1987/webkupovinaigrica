using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Stavka : Entitet
    {
        public int RacunId { get; set; }
        public int ProizvodId { get; set; }

        [ForeignKey("RacunId")]
        public required Racun Racun { get; set; }

        [ForeignKey("ProizvodId")]
        public required Proizvod Proizvod { get; set; }

        public int Kolicina { get; set; }

        public decimal Cijena { get; set; }
    }
}