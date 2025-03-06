using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public DbSet<Kupac> Kupci { get; set; }
        public DbSet<Proizvod> Proizvodi { get; set; }
        public DbSet<Racun> Racuni { get; set; }
        public DbSet<Stavka> Stavke { get; set; }

        public BackendContext(DbContextOptions<BackendContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Racun>()
                .HasOne(r => r.Kupac);

            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.Racun);

            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.Proizvod);

            modelBuilder.Entity<Proizvod>()
                .Property(p => p.Cijena)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Stavka>()
                .Property(s => s.Cijena)
                .HasColumnType("decimal(18, 2)");
        }
    }
}