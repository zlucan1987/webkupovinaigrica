using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Mapping
{
    public class BackendProfile : Profile
    {
        public BackendProfile()
        {
            // map za Kupac
            CreateMap<Kupac, KupacDTORead>();
            CreateMap<KupacDTOInsertUpdate, Kupac>();
            CreateMap<Kupac, KupacDTOInsertUpdate>();

            // map Proizvod
            CreateMap<Proizvod, ProizvodDTORead>();
            CreateMap<ProizvodDTOInsertUpdate, Proizvod>();
            CreateMap<Proizvod, ProizvodDTOInsertUpdate>();

            // map za Racun
            CreateMap<Racun, RacunDTORead>().ConstructUsing(entitet =>
                new RacunDTORead(
                    entitet.Sifra,
                    entitet.Datum,
                    entitet.Kupac.Ime + " " + entitet.Kupac.Prezime
                ));
            CreateMap<RacunDTOInsertUpdate, Racun>();
            CreateMap<Racun, RacunDTOInsertUpdate>();

            // map Stavka
            CreateMap<Stavka, StavkaDTORead>().ForCtorParam(
                "ProizvodNaziv",
                opt => opt.MapFrom(src => src.Proizvod.NazivIgre)
            );
            CreateMap<StavkaDTOInsert, Stavka>();
            CreateMap<Stavka, StavkaDTOInsert>()
                .ForMember(dest => dest.RacunSifra, opt => opt.MapFrom(src => src.Racun.Sifra))
                .ForMember(dest => dest.ProizvodSifra, opt => opt.MapFrom(src => src.Proizvod.Sifra));

            CreateMap<StavkaDTOUpdate, Stavka>()
            .ForMember(dest => dest.Proizvod, opt => opt.MapFrom(src => new Proizvod { Sifra = src.ProizvodSifra }))
            .ForMember(dest => dest.Racun, opt => opt.Ignore());
        }
    }
}