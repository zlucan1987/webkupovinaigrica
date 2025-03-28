﻿using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;


#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(BackendContext))]
    partial class BackendContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Kupac", b =>
                {
                    b.Property<int>("Sifra")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Sifra"));

                    b.Property<string>("Ime")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Mjesto")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Prezime")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Ulica")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Sifra");

                    b.ToTable("Kupci");
                });

            modelBuilder.Entity("Backend.Models.Proizvod", b =>
                {
                    b.Property<int>("Sifra")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Sifra"));

                    b.Property<decimal>("Cijena")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<string>("NazivIgre")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Sifra");

                    b.ToTable("Proizvodi");
                });

            modelBuilder.Entity("Backend.Models.Racun", b =>
                {
                    b.Property<int>("Sifra")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Sifra"));

                    b.Property<DateTime>("Datum")
                        .HasColumnType("datetime2");

                    b.Property<int>("kupac")
                        .HasColumnType("int");

                    b.HasKey("Sifra");

                    b.HasIndex("kupac");

                    b.ToTable("Racuni");
                });

            modelBuilder.Entity("Backend.Models.Stavka", b =>
                {
                    b.Property<int>("Sifra")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Sifra"));

                    b.Property<decimal>("Cijena")
                        .HasColumnType("decimal(18, 2)");

                    b.Property<int>("Kolicina")
                        .HasColumnType("int");

                    b.Property<int>("ProizvodSifra")
                        .HasColumnType("int");

                    b.Property<int>("RacunSifra")
                        .HasColumnType("int");

                    b.HasKey("Sifra");

                    b.HasIndex("ProizvodSifra");

                    b.HasIndex("RacunSifra");

                    b.ToTable("Stavke");
                });

            modelBuilder.Entity("Backend.Models.Racun", b =>
                {
                    b.HasOne("Backend.Models.Kupac", "Kupac")
                        .WithMany()
                        .HasForeignKey("kupac")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Kupac");
                });

            modelBuilder.Entity("Backend.Models.Stavka", b =>
                {
                    b.HasOne("Backend.Models.Proizvod", "Proizvod")
                        .WithMany()
                        .HasForeignKey("ProizvodSifra")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Racun", "Racun")
                        .WithMany("Stavke")
                        .HasForeignKey("RacunSifra")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Proizvod");

                    b.Navigation("Racun");
                });

            modelBuilder.Entity("Backend.Models.Racun", b =>
                {
                    b.Navigation("Stavke");
                });
#pragma warning restore 612, 618
        }
    }
}
