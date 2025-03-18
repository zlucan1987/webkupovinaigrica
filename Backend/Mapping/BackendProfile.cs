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
                    entitet.Kupac.Ime + " " + entitet.Kupac.Prezime,
                    entitet.Kupac.Sifra // uključivanje šifre kupca
                ));
            CreateMap<RacunDTOInsertUpdate, Racun>()
                .ForMember(dest => dest.KupacId, opt => opt.MapFrom(src => src.KupacSifra));
            CreateMap<Racun, RacunDTOInsertUpdate>()
                .ForMember(dest => dest.KupacSifra, opt => opt.MapFrom(src => src.KupacId));

            // map Stavka
            CreateMap<Stavka, StavkaDTORead>()
                .ForCtorParam("ProizvodNaziv", opt => opt.MapFrom(src => src.Proizvod.NazivIgre))
                .ForCtorParam("RacunSifra", opt => opt.MapFrom(src => src.Racun.Sifra))
                .ForCtorParam("ProizvodSifra", opt => opt.MapFrom(src => src.Proizvod.Sifra));

            CreateMap<StavkaDTOInsert, Stavka>()
                .ForMember(dest => dest.RacunId, opt => opt.MapFrom(src => src.RacunSifra))
                .ForMember(dest => dest.ProizvodId, opt => opt.MapFrom(src => src.ProizvodSifra));

            CreateMap<Stavka, StavkaDTOInsert>()
                .ForMember(dest => dest.RacunSifra, opt => opt.MapFrom(src => src.RacunId))
                .ForMember(dest => dest.ProizvodSifra, opt => opt.MapFrom(src => src.ProizvodId));

            CreateMap<StavkaDTOUpdate, Stavka>()
                .ForMember(dest => dest.ProizvodId, opt => opt.MapFrom(src => src.ProizvodSifra));
        }
    }
}