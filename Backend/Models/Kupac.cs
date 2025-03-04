using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Kupac : Entitet
    {
        public string Ime { get; set; } = "";

        public string Prezime { get; set; } = "";

        public string Ulica { get; set; } = "";

        public string Mjesto { get; set; } = "";

    }
}