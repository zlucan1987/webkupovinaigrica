using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTO
{
    /// <summary>
    /// DTO za detaljne podatke o operateru.
    /// </summary>
    public class OperaterDetailsDTO
    {
        /// <summary>
        /// Šifra operatera
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Korisničko ime operatera
        /// </summary>
        public string? KorisnickoIme { get; set; }
        
        /// <summary>
        /// Ime operatera
        /// </summary>
        public string? Ime { get; set; }
        
        /// <summary>
        /// Prezime operatera
        /// </summary>
        public string? Prezime { get; set; }
        
        /// <summary>
        /// Nadimak operatera
        /// </summary>
        public string? Nickname { get; set; }
        
        /// <summary>
        /// Označava je li nadimak zaključan
        /// </summary>
        public bool NicknameLocked { get; set; }
        
        /// <summary>
        /// Status aktivnosti operatera
        /// </summary>
        public bool Aktivan { get; set; }
        
        /// <summary>
        /// Uloge operatera
        /// </summary>
        public List<string> Uloge { get; set; } = new List<string>();
        
        /// <summary>
        /// Datum zadnje promjene lozinke
        /// </summary>
        public DateTime? ZadnjaPromjenaLozinke { get; set; }
        
        /// <summary>
        /// Datum kreiranja operatera
        /// </summary>
        public DateTime DatumKreiranja { get; set; }
    }
}
