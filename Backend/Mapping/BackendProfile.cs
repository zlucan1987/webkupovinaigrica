using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Mapping
{
    public class BackendProfile : Profile
    {
        public BackendProfile()
        {
            // Mapiranja za Kupac
            CreateMap<Kupac, KupacDTORead>();
            CreateMap<KupacDTOInsertUpdate, Kupac>();
            CreateMap<Kupac, KupacDTOInsertUpdate>();

            // Mapiranja za Proizvod
            CreateMap<Proizvod, ProizvodDTORead>();
            CreateMap<ProizvodDTOInsertUpdate, Proizvod>();
            CreateMap<Proizvod, ProizvodDTOInsertUpdate>();

            // Mapiranja za Racun
            CreateMap<Racun, RacunDTORead>().ConstructUsing(entitet =>
               new RacunDTORead(
                  entitet.Sifra,
                  entitet.Datum,
                  entitet.Kupac.Ime + " " + entitet.Kupac.Prezime
                 ));
            CreateMap<RacunDTOInsertUpdate, Racun>();
            CreateMap<Racun, RacunDTOInsertUpdate>();

            // Mapiranja za Stavka
            CreateMap<Stavka, StavkaDTORead>();
            CreateMap<StavkaDTOInsertUpdate, Stavka>();
            CreateMap<Stavka, StavkaDTOInsertUpdate>();
        }
    }
}