using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Racun : Entitet
    {
        public DateTime Datum { get; set; }

        public int KupacId { get; set; }

        [ForeignKey("KupacId")] 
        public required Kupac Kupac { get; set; }

        public ICollection<Stavka>? Stavke { get; set; }
    }
}