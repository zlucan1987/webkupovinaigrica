using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendAPP.Data
{
    public class webkupovinaigrica : DbContext
    {

        public webkupovinaigrica(DbContextOptions<webkupovinaigrica> opcije) : base(opcije)
        {
            //ovdje se  mogu fino postaviti opcije, ali ne za sada
        }


        public DbSet<Proizvod> Proizvodi { get; set; } // zbog ovog ovdje Smjerovi se tablica zove u mnozini

    }
}
