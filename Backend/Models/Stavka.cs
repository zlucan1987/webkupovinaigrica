using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Stavka : Entitet
    {
        [ForeignKey("racun")]
        public required Racun Racun { get; set; } 

        [ForeignKey("proizvod")]
        public required Proizvod Proizvod { get; set; }

        public int Kolicina { get; set; }

        public decimal Cijena { get; set; }
    }
}