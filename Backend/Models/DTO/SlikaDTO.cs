using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za unos slike.
    /// </summary>
    /// <param name="Base64">Slika zapisana u Base64 formatu</param>
    public record SlikaDTO([Required(ErrorMessage = "Base64 zapis slike obavezno")] string Base64);
}