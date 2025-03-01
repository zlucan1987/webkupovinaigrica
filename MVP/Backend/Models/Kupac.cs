using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Kupac : Entitet
    {
        [Required(ErrorMessage = "Ime je obavezno.")]
        [MaxLength(50, ErrorMessage = "Ime ne smije biti duže od 50 znakova.")]
        public string Ime { get; set; } = "";

        [Required(ErrorMessage = "Prezime je obavezno.")]
        [MaxLength(100, ErrorMessage = "Prezime ne smije biti duže od 100 znakova.")]
        public string Prezime { get; set; } = "";

        [MaxLength(100, ErrorMessage = "Ulica ne smije biti duža od 100 znakova.")]
        public string Ulica { get; set; } = "";

        [MaxLength(100, ErrorMessage = "Mjesto ne smije biti duže od 100 znakova.")]
        public string Mjesto { get; set; } = "";
    }
}
