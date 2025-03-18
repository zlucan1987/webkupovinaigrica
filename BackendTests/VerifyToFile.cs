using System;
using System.IO;
using BCrypt.Net;

class VerifyToFile
{
    static void Main()
    {
        try
        {
            string outputPath = Path.Combine(Directory.GetCurrentDirectory(), "verify_result.txt");
            
            string password = "edunova";
            string hash = "$2a$11$7OKmydnUwKGgQVlGmyhxLOQyiQXgaJeK7k5zXEPQFHQvMpAzLZVFu";
            
            bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
            
            // Generate a new hash for the same password
            string newHash = BCrypt.Net.BCrypt.HashPassword(password);
            
            // Verify with the new hash
            bool isNewHashValid = BCrypt.Net.BCrypt.Verify(password, newHash);
            
            // Write results to file and console
            string results = $"=== VERIFY TEST RESULTS ===\n" +
                             $"Password: '{password}'\n" +
                             $"Hash: '{hash}'\n" +
                             $"Is Valid: {isValid}\n" +
                             $"New hash: '{newHash}'\n" +
                             $"Is new hash valid: {isNewHashValid}\n" +
                             $"=== END TEST ===";
            
            File.WriteAllText(outputPath, results);
            Console.WriteLine(results);
            Console.WriteLine($"Results also written to {outputPath}");
        }
        catch (Exception ex)
        {
            string errorPath = Path.Combine(Directory.GetCurrentDirectory(), "verify_error.txt");
            File.WriteAllText(errorPath, $"ERROR: {ex.Message}\nStack Trace: {ex.StackTrace}");
            Console.WriteLine($"Error occurred. Check {errorPath} for details.");
        }
    }
}
