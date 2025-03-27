using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Model operatera (korisnika) u sustavu
    /// </summary>
    public class Operater : Entitet
    {
        /// <summary>
        /// Korisničko ime operatera (email adresa)
        /// </summary>
        [Required]
        public string? KorisnickoIme { get; set; } 

        /// <summary>
        /// Lozinka operatera (hashirana)
        /// </summary>
        [Required]
        public string? Lozinka { get; set; }

        /// <summary>
        /// Ime operatera
        /// </summary>
        public string? Ime { get; set; }

        /// <summary>
        /// Prezime operatera
        /// </summary>
        public string? Prezime { get; set; }

        /// <summary>
        /// Status aktivnosti operatera
        /// </summary>
        public bool Aktivan { get; set; } = true;
        
        /// <summary>
        /// Nadimak korisnika koji se prikazuje javno
        /// </summary>
        public string? Nickname { get; set; }
        
        /// <summary>
        /// Označava je li nadimak zaključan (korisnik ga ne može mijenjati)
        /// </summary>
        public bool NicknameLocked { get; set; } = false;
        
        /// <summary>
        /// Datum i vrijeme zadnje promjene lozinke
        /// </summary>
        public DateTime? ZadnjaPromjenaLozinke { get; set; }
        
        /// <summary>
        /// Broj neuspjelih pokušaja prijave
        /// </summary>
        public int NeuspjeliPokusajiPrijave { get; set; } = 0;
        
        /// <summary>
        /// Datum i vrijeme zaključavanja računa zbog previše neuspjelih pokušaja prijave
        /// </summary>
        public DateTime? DatumZakljucavanja { get; set; }
        
        /// <summary>
        /// Datum kreiranja korisničkog računa
        /// </summary>
        public DateTime? DatumKreiranja { get; set; } = DateTime.UtcNow;
        
        /// <summary>
        /// Veza s ulogama (many-to-many)
        /// </summary>
        public ICollection<OperaterOperaterUloga> OperaterOperaterUloge { get; set; } = new List<OperaterOperaterUloga>();
    }
}
