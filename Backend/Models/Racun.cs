using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Racun : Entitet
    {
        [Required(ErrorMessage = "Datum je obavezan.")]
        public DateTime Datum { get; set; }

        [Required(ErrorMessage = "Kupac je obavezan.")]
        [ForeignKey("Kupac")] // Promjena ovdje
        public int Kupac { get; set; } // Promjena ovdje
        public Kupac KupacNavigation { get; set; } // Dodano navigacijsko svojstvo
        public ICollection<Stavka> Stavke { get; set; }
    }
}