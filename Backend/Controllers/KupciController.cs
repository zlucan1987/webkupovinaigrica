using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]

    public class KupciController : ControllerBase
    {


        private readonly BackendContext _context;

        public KupciController(BackendContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try 
            { 
                return Ok(_context.Kupci);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
