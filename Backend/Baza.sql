SELECT name, collation_name FROM sys.databases;
GO
ALTER DATABASE db_ab2d4b_webkupovinaigrica SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
ALTER DATABASE db_ab2d4b_webkupovinaigrica COLLATE Latin1_General_100_CI_AI_SC_UTF8;
GO
ALTER DATABASE db_ab2d4b_webkupovinaigrica SET MULTI_USER;
GO
SELECT name, collation_name FROM sys.databases;
GO


CREATE TABLE Proizvodi (
    ProizvodID INT PRIMARY KEY IDENTITY(1,1),
    NazivIgre NVARCHAR(100) NOT NULL,
    Cijena DECIMAL(10, 2) NOT NULL
);
GO


CREATE TABLE Kupci (
    KupacID INT PRIMARY KEY IDENTITY(1,1),
    Ime NVARCHAR(50) NOT NULL,
    Prezime NVARCHAR(100) NOT NULL,
    Ulica NVARCHAR(100) NOT NULL,
    Mjesto NVARCHAR(100) NOT NULL
);
GO


CREATE TABLE Racuni (
    RacunID INT PRIMARY KEY IDENTITY(1,1),
    Datum DATE NOT NULL,
    Kupac INT FOREIGN KEY REFERENCES Kupci(KupacID)
);
GO


CREATE TABLE Stavke (
    StavkaID INT PRIMARY KEY IDENTITY(1,1),
    Racun INT FOREIGN KEY REFERENCES Racuni(RacunID),
    Proizvod INT FOREIGN KEY REFERENCES Proizvodi(ProizvodID),
    Kolicina INT NOT NULL,
    Cijena DECIMAL(10, 2) NOT NULL
);
GO

--1
insert into proizvodi(nazivigre, cijena) values
('World of Tanks', 0.00),
('LOL', 0.00),
('PUBG', 21.99),
('FIFA', 99.99),
('RDR', 49.99);

--2
insert into kupci(ime,prezime,ulica,mjesto) values
('Marko', 'Periæ', 'Matice hrvatske 12', 'Vinkovci'),
('Ivan','Markoviæ','Ulica Kralja Zvonimira','Vinkovci'),
('Martin','Vida', 'Duga ulica', 'Vinkovci'),
('Željko','Baraban', 'Lapovaèka 19', 'Vinkovci'),
('Petar','Maj','Ružina ulica','Vinkovci');

--3
insert into racuni(datum, kupac) values
('2025-11-25', 1),
('2025-10-19', 3),
('2025-09-15', 2); 

--4
insert into stavke(racun, proizvod, kolicina, cijena) values
(1, 1, 2, 0.00),
(1, 3, 1, 21.99),
(2, 2, 3, 0.00); 

select * from proizvodi;
select * from kupci;
select * from racuni;
select * from stavke;