namespace Backend.Models.DTO
{
    public record StavkaDTORead(
        int Sifra,
        int Racun,
        int Proizvod,
        int Kolicina,
        decimal Cijena
    );
}