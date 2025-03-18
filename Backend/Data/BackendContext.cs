﻿﻿﻿﻿﻿﻿﻿using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class BackendContext : DbContext
    {
        public DbSet<Kupac> Kupci { get; set; }
        public DbSet<Proizvod> Proizvodi { get; set; }
        public DbSet<Racun> Racuni { get; set; }
        public DbSet<Stavka> Stavke { get; set; }
        public DbSet<Operater> Operateri { get; set; } // dodao za operater
        public DbSet<OperaterUloga> OperaterUloge { get; set; }
        public DbSet<OperaterOperaterUloga> OperaterOperaterUloge { get; set; }

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

            // Map RacunId na "racun" u bazi
            modelBuilder.Entity<Stavka>()
                .Property(s => s.RacunId)
                .HasColumnName("racun");

            // Map ProizvodId na "proizvod" u bazi
            modelBuilder.Entity<Stavka>()
                .Property(s => s.ProizvodId)
                .HasColumnName("proizvod");
                
            // Mapiranje za Operater entitet
            // Komentiramo mapiranja jer imena stupaca u bazi odgovaraju imenima svojstava u modelu
            /*
            modelBuilder.Entity<Operater>()
                .Property(o => o.KorisnickoIme)
                .HasColumnName("korisnicko_ime");
                
            modelBuilder.Entity<Operater>()
                .Property(o => o.Ime)
                .HasColumnName("ime");
                
            modelBuilder.Entity<Operater>()
                .Property(o => o.Prezime)
                .HasColumnName("prezime");
                
            modelBuilder.Entity<Operater>()
                .Property(o => o.Lozinka)
                .HasColumnName("lozinka");
                
            modelBuilder.Entity<Operater>()
                .Property(o => o.Aktivan)
                .HasColumnName("aktivan");
            */

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
                
            // Konfiguracija veze između Operater i OperaterUloga (many-to-many)
            modelBuilder.Entity<OperaterOperaterUloga>()
                .HasOne(oou => oou.Operater)
                .WithMany(o => o.OperaterOperaterUloge)
                .HasForeignKey(oou => oou.OperaterId);
                
            modelBuilder.Entity<OperaterOperaterUloga>()
                .HasOne(oou => oou.OperaterUloga)
                .WithMany(ou => ou.OperaterOperaterUloge)
                .HasForeignKey(oou => oou.OperaterUlogaId);
        }
    }
}
