-- Provjeri postoji li uloga 'User'
IF NOT EXISTS (SELECT 1 FROM OperaterUloge WHERE Naziv = 'User')
BEGIN
    -- Dodaj ulogu 'User'
    INSERT INTO OperaterUloge (Naziv, Opis)
    VALUES ('User', 'Standardna korisnička uloga');
END

-- Provjeri postoji li uloga 'Admin'
IF NOT EXISTS (SELECT 1 FROM OperaterUloge WHERE Naziv = 'Admin')
BEGIN
    -- Dodaj ulogu 'Admin'
    INSERT INTO OperaterUloge (Naziv, Opis)
    VALUES ('Admin', 'Administratorska uloga s punim pravima');
END

-- Provjeri postoji li admin korisnik
IF NOT EXISTS (SELECT 1 FROM Operateri WHERE KorisnickoIme = 'admin@admin.com')
BEGIN
    -- Dodaj admin korisnika (lozinka: admin123)
    -- Lozinka je hashirana pomoću BCrypt
    INSERT INTO Operateri (KorisnickoIme, Lozinka, Ime, Prezime, Aktivan)
    VALUES ('admin@admin.com', '$2a$12$evbGgCZYJaC9QikdcBs8Te5G8XJJw4AhBuLmCxsOI80PeeFiQt2B6', 'Admin', 'Admin', 1);
    
    -- Dohvati ID admin korisnika
    DECLARE @AdminId INT;
    SELECT @AdminId = Sifra FROM Operateri WHERE KorisnickoIme = 'admin@admin.com';
    
    -- Dohvati ID Admin uloge
    DECLARE @AdminRoleId INT;
    SELECT @AdminRoleId = Sifra FROM OperaterUloge WHERE Naziv = 'Admin';
    
    -- Dodaj vezu između admin korisnika i Admin uloge
    INSERT INTO OperaterOperaterUloge (OperaterId, OperaterUlogaId)
    VALUES (@AdminId, @AdminRoleId);
END
