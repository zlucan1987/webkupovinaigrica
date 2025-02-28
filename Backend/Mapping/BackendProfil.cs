using AutoMapper;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Mapping
{
    public class BackendProfil : Profile
    {
        public BackendProfil()
        {
            // kreiramo mapiranja: izvor, odredište
            CreateMap<Kupac, KupacDTORead>();
            CreateMap<KupacDTOInsertUpdate, Kupac>();
            CreateMap<Kupac, KupacDTOInsertUpdate>();

        }
    }
}