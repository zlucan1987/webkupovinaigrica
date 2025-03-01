using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> options) : base(options)
        {
            // Ovdje se mogu postaviti opcije ako je potrebno
        }

        public DbSet<Kupac> Kupci { get; set; }
        public DbSet<Proizvod> Proizvodi { get; set; }
        public DbSet<Racun> Racuni { get; set; }
        public DbSet<Stavka> Stavke { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracija za Racun entitet
            modelBuilder.Entity<Racun>()
                .HasOne(r => r.KupacNavigation)
                .WithMany(k => k.Racuni)
                .HasForeignKey(r => r.Kupac);

            // Konfiguracija za Stavka entitet
            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.RacunNavigation)
                .WithMany(r => r.Stavke)
                .HasForeignKey(s => s.Racun);

            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.ProizvodNavigation)
                .WithMany(p => p.Stavke)
                .HasForeignKey(s => s.Proizvod);
        }
    }
}