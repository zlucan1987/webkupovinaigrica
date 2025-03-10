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

            // Map KupacId na "kupac" u bazi
            modelBuilder.Entity<Racun>()
                .Property(r => r.KupacId)
                .HasColumnName("kupac");

            // Map RacunId nae "racun" u bazi
            modelBuilder.Entity<Stavka>()
                .Property(s => s.RacunId)
                .HasColumnName("racun");

            // Map ProizvodId na "proizvod" u bazi
            modelBuilder.Entity<Stavka>()
                .Property(s => s.ProizvodId)
                .HasColumnName("proizvod");

            modelBuilder.Entity<Racun>()
                .HasOne(r => r.Kupac)
                .WithMany()
                .HasForeignKey(r => r.KupacId);

            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.Racun)
                .WithMany(r => r.Stavke)
                .HasForeignKey(s => s.RacunId);

            modelBuilder.Entity<Stavka>()
                .HasOne(s => s.Proizvod)
                .WithMany()
                .HasForeignKey(s => s.ProizvodId);

            modelBuilder.Entity<Proizvod>()
                .Property(p => p.Cijena)
                .HasColumnType("decimal(18, 2)");

            modelBuilder.Entity<Stavka>()
                .Property(s => s.Cijena)
                .HasColumnType("decimal(18, 2)");
        }
    }
}