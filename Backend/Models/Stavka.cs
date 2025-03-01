using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Stavka : Entitet
    {
        [Required(ErrorMessage = "Račun je obavezan.")]
        [ForeignKey("Racun")]
        public int Racun { get; set; } // Promjena imena ovdje
        public Racun RacunNavigation { get; set; } // Dodano navigacijsko svojstvo

        [Required(ErrorMessage = "Proizvod je obavezan.")]
        [ForeignKey("Proizvod")]
        public int Proizvod { get; set; } // Promjena imena ovdje
        public Proizvod ProizvodNavigation { get; set; } // Dodano navigacijsko svojstvo

        [Required(ErrorMessage = "Količina je obavezna.")]
        [Range(1, int.MaxValue, ErrorMessage = "Količina mora biti veća od 0.")]
        public int Kolicina { get; set; }

        [Required(ErrorMessage = "Cijena je obavezna.")]
        [Range(0, double.MaxValue, ErrorMessage = "Cijena ne smije biti negativna.")]
        public decimal Cijena { get; set; }
    }
}