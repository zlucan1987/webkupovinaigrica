namespace Backend.Models.DTO
{

    public record StavkaDTORead(
        int Sifra,
        string ProizvodNaziv,
        int Kolicina,
        decimal Cijena
    );

}