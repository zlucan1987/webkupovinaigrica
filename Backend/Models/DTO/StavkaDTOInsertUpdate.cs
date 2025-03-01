using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record StavkaDTOInsertUpdate(
        [Required(ErrorMessage = "Račun je obavezan.")]
        int Racun,

        [Required(ErrorMessage = "Proizvod je obavezan.")]
        int Proizvod,

        [Required(ErrorMessage = "Količina je obavezna.")]
        [Range(1, int.MaxValue, ErrorMessage = "Količina mora biti veća od 0.")]
        int Kolicina,

        [Required(ErrorMessage = "Cijena je obavezna.")]
        [Range(0, double.MaxValue, ErrorMessage = "Cijena ne smije biti negativna.")]
        decimal Cijena
    );
}