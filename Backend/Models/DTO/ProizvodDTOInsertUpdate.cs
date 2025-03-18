using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    public record ProizvodDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv igre je obavezan.")]
        string NazivIgre,

        [Required(ErrorMessage = "Cijena je obavezna.")]
        [Range(0, double.MaxValue, ErrorMessage = "Cijena ne smije biti negativna.")]
        decimal Cijena
    );
}
