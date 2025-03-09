using AutoMapper;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{

    public abstract class BackendController : ControllerBase
    {

        // dependecy injection
        // 1. definira privatno svojstvo
        protected readonly BackendContext _context;

        protected readonly IMapper _mapper;


        // dependecy injection
        // 2. proslijedi instancu kroz konstruktor
        public BackendController(BackendContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    }
}