using System;

namespace Backend.Models.DTO
{
    public record RacunDTORead(
        int Sifra,
        DateTime Datum,
        string KupacImePrezime,
        int KupacSifra
        );
}
