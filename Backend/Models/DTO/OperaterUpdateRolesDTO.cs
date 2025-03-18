using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za ažuriranje uloga operatera.
    /// </summary>
    public class OperaterUpdateRolesDTO
    {
        /// <summary>
        /// Šifra operatera
        /// </summary>
        [Required(ErrorMessage = "ID operatera je obavezan.")]
        public int OperaterId { get; set; }
        
        /// <summary>
        /// Lista uloga koje se dodjeljuju operateru
        /// </summary>
        [Required(ErrorMessage = "Lista uloga je obavezna.")]
        public List<string> Uloge { get; set; } = new List<string>();
    }
}
