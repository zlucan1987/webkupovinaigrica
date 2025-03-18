namespace Backend.Models.DTO
{

    public record StavkaDTORead(
        int Sifra,
        int RacunSifra,
        string ProizvodNaziv,
        int ProizvodSifra,
        int Kolicina,
        decimal Cijena
    );

}
