using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record KupacDTOInsertUpdate(
        [Required(ErrorMessage = "Ime je obavezno")]
        string Ime,

        [Required(ErrorMessage = "Prezime je obavezno")]
        string Prezime,
        string Ulica, 
        string Mjesto
    );
}
