using System;
using System.Data.SqlClient;

partial class Program
{
    static void Main(string[] args)
    {
        try
        {
            // Hard-coded connection string - you'll need to replace this with your actual connection string
            string connectionString = "Server=localhost;Database=webkupovinaigrica;User Id=sa;Password=SQL;TrustServerCertificate=True;";
            
            Console.WriteLine("Enter the connection string (press Enter to use the default):");
            string input = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(input))
            {
                connectionString = input;
            }
            
            // Generate a new hash for the password "edunova"
            string newHash = BCrypt.Net.BCrypt.HashPassword("edunova");
            Console.WriteLine($"Generated new hash: {newHash}");
            
            // Update the user in the database
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                Console.WriteLine("Connected to the database successfully.");
                
                // First check if the user exists
                string checkSql = "SELECT COUNT(*) FROM Operateri WHERE KorisnickoIme = @KorisnickoIme";
                using (var checkCommand = new SqlCommand(checkSql, connection))
                {
                    checkCommand.Parameters.AddWithValue("@KorisnickoIme", "edunova@edunova.hr");
                    int count = (int)checkCommand.ExecuteScalar();
                    
                    if (count == 0)
                    {
                        // User doesn't exist, create a new one
                        string insertSql = "INSERT INTO Operateri (KorisnickoIme, Lozinka, Ime, Prezime, Aktivan) VALUES (@KorisnickoIme, @Lozinka, @Ime, @Prezime, @Aktivan)";
                        using (var insertCommand = new SqlCommand(insertSql, connection))
                        {
                            insertCommand.Parameters.AddWithValue("@KorisnickoIme", "edunova@edunova.hr");
                            insertCommand.Parameters.AddWithValue("@Lozinka", newHash);
                            insertCommand.Parameters.AddWithValue("@Ime", "Test");
                            insertCommand.Parameters.AddWithValue("@Prezime", "User");
                            insertCommand.Parameters.AddWithValue("@Aktivan", true);
                            
                            int rowsAffected = insertCommand.ExecuteNonQuery();
                            Console.WriteLine($"User created successfully. Rows affected: {rowsAffected}");
                        }
                    }
                    else
                    {
                        // User exists, update the password
                        string updateSql = "UPDATE Operateri SET Lozinka = @Lozinka WHERE KorisnickoIme = @KorisnickoIme";
                        using (var updateCommand = new SqlCommand(updateSql, connection))
                        {
                            updateCommand.Parameters.AddWithValue("@KorisnickoIme", "edunova@edunova.hr");
                            updateCommand.Parameters.AddWithValue("@Lozinka", newHash);
                            
                            int rowsAffected = updateCommand.ExecuteNonQuery();
                            Console.WriteLine($"User updated successfully. Rows affected: {rowsAffected}");
                        }
                    }
                }
            }
            
            Console.WriteLine("Operation completed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        }
        
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }
}
