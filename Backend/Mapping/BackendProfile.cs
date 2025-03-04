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
            CreateMap<Racun, RacunDTORead>()
                .ForMember(dest => dest.Sifra, opt => opt.MapFrom(src => src.Sifra)); // Dodano eksplicitno mapiranje za Sifra
            CreateMap<RacunDTOInsertUpdate, Racun>();
            CreateMap<Racun, RacunDTOInsertUpdate>();

            // Mapiranja za Stavka
            CreateMap<Stavka, StavkaDTORead>();
            CreateMap<StavkaDTOInsertUpdate, Stavka>();
            CreateMap<Stavka, StavkaDTOInsertUpdate>();
        }
    }
}