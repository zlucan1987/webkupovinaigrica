using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Proizvod : Entitet
    {
        [Required(ErrorMessage = "Naziv igre je obavezan.")]
        [MaxLength(100, ErrorMessage = "Naziv igre ne smije biti duži od 100 znakova.")]
        public string NazivIgre { get; set; } = "";

        [Required(ErrorMessage = "Cijena je obavezna.")]
        [Range(0, double.MaxValue, ErrorMessage = "Cijena ne smije biti negativna.")]
        public decimal Cijena { get; set; }

        public ICollection<Stavka> Stavke { get; set; } // dodano svojstvo za navigaciju 
    }
}