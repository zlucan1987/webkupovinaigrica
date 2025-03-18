using System;
using BCrypt.Net;

partial class Program
{
    static void Main()
    {
        try
        {
            Console.WriteLine("=== TEST BCRYPT HASH ===");
            
            // Hash koji smo koristili u INSERT naredbi
            string storedHash = "$2a$11$7OKmydnUwKGgQVlGmyhxLOQyiQXgaJeK7k5zXEPQFHQvMpAzLZVFu";
            
            // Lozinka koju koristimo za autorizaciju
            string password = "edunova";
            
            Console.WriteLine($"Password: {password}");
            Console.WriteLine($"Stored Hash: {storedHash}");
            
            // Provjera je li hash validan za lozinku
            bool isValid = BCrypt.Net.BCrypt.Verify(password, storedHash);
            Console.WriteLine($"Is Valid: {isValid}");
            
            // Generiranje novog hasha za istu lozinku
            string newHash = BCrypt.Net.BCrypt.HashPassword(password);
            Console.WriteLine($"Novi hash za istu lozinku: {newHash}");
            
            // Provjera novog hasha
            bool isNewHashValid = BCrypt.Net.BCrypt.Verify(password, newHash);
            Console.WriteLine($"Je li novi hash validan: {isNewHashValid}");
            
            Console.WriteLine("=== KRAJ TESTA ===");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GREŠKA: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        }
    }
}
