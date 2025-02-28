namespace Backend.Models.DTO
{
        public record KupacDTORead(
            int Sifra, 
            string Ime,
            string Prezime,
            string Ulica,
            string Mjesto
        );
    }