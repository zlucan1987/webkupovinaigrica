using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> options) : base(options)
        {
            // Options can be set here if needed
        }

        public DbSet<Kupac> Kupci { get; set; } // zbog ovog ovdje Smjerovi se tablica zove u mnozini
    }
}
