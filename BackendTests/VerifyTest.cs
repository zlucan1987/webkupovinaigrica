using System;
using BCrypt.Net;

class VerifyTest
{
    static void Main()
    {
        try
        {
            Console.WriteLine("=== VERIFY TEST ===");
            
            // Test with the hash from the error message
            string password = "edunova";
            string hash = "$2a$11$7OKmydnUwKGgQVlGmyhxLOQyiQXgaJeK7k5zXEPQFHQvMpAzLZVFu";
            
            Console.WriteLine($"Password: '{password}'");
            Console.WriteLine($"Hash: '{hash}'");
            
            bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
            Console.WriteLine($"Is Valid: {isValid}");
            
            // Generate a new hash for the same password
            string newHash = BCrypt.Net.BCrypt.HashPassword(password);
            Console.WriteLine($"New hash: '{newHash}'");
            
            // Verify with the new hash
            bool isNewHashValid = BCrypt.Net.BCrypt.Verify(password, newHash);
            Console.WriteLine($"Is new hash valid: {isNewHashValid}");
            
            Console.WriteLine("=== END TEST ===");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        }
    }
}
