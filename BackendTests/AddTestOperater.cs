using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Backend.Tests
{
    public class AddTestOperater
    {
        public static void Main(string[] args)
        {
            
            var serviceCollection = new ServiceCollection();
            
            
            var connectionString = GetConnectionString();
            
            
            serviceCollection.AddDbContext<BackendContext>(options =>
                options.UseSqlServer(connectionString));
            
            
            var serviceProvider = serviceCollection.BuildServiceProvider();
            
            
            using (var context = serviceProvider.GetService<BackendContext>())
            {
                
                var existingUser = context.Operateri
                    .FirstOrDefault(o => o.KorisnickoIme == "edunova@edunova.hr");
                
                if (existingUser != null)
                {
                    Console.WriteLine("Test user already exists.");
                    return;
                }
                
                // Kreiranje novog test usera
                var testUser = new Operater
                {
                    KorisnickoIme = "edunova@edunova.hr",
                    Lozinka = BCrypt.Net.BCrypt.HashPassword("edunova"),
                    Ime = "Test",
                    Prezime = "User",
                    Aktivan = true
                };
                
                // Dodavanje usera u bazu
                context.Operateri.Add(testUser);
                context.SaveChanges();
                
                Console.WriteLine("Test user added successfully.");
            }
        }
        
        private static string GetConnectionString()
        {
            
            var appSettingsPath = "appsettings.json";
            var appSettings = System.IO.File.ReadAllText(appSettingsPath);
            
            
            var connectionStringStart = appSettings.IndexOf("\"ConnectionStrings\":");
            var connectionStringEnd = appSettings.IndexOf("}", connectionStringStart);
            var connectionStringSection = appSettings.Substring(connectionStringStart, connectionStringEnd - connectionStringStart);
            
            var defaultConnectionStart = connectionStringSection.IndexOf("\"BackendContext\":");
            var defaultConnectionEnd = connectionStringSection.IndexOf(",", defaultConnectionStart);
            if (defaultConnectionEnd == -1)
            {
                defaultConnectionEnd = connectionStringSection.IndexOf("}", defaultConnectionStart);
            }
            
            var defaultConnection = connectionStringSection.Substring(defaultConnectionStart, defaultConnectionEnd - defaultConnectionStart);
            var connectionString = defaultConnection.Split(':')[1].Trim().Trim('"');
            
            return connectionString;
        }
    }
}
