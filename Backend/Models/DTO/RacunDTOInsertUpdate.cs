using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record RacunDTOInsertUpdate(
        [Required(ErrorMessage = "Datum je obavezan.")]
        DateTime Datum,

        [Required(ErrorMessage = "Kupac je obavezan.")]
        int KupacSifra
    );
}
