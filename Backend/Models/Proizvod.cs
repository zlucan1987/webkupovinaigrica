using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Proizvod : Entitet
    {
        public string NazivIgre { get; set; } = "";
        public decimal Cijena { get; set; }
    }
}