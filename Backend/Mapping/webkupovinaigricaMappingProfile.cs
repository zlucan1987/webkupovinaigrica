using AutoMapper;
using webkupovinaigrica.Models;
using webkupovinaigrica.Models.DTO;

namespace webkupovinaigrica.Mapping
{
    public class BackendProfil : Profile
    {
        public BackendProfil()
        {
            // kreiramo mapiranja: izvor, odredište
            CreateMap<Kupac, KupacDTORead>();
            CreateMap<KupacDTOInsertUpdate, Kupac>();
            CreateMap<Kupac, KupacDTOInsertUpdate>();