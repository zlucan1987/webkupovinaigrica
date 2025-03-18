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

-- Kreiranje tablice Operateri
CREATE TABLE Operateri (
    Sifra INT IDENTITY(1,1) PRIMARY KEY,
    KorisnickoIme NVARCHAR(255) NOT NULL,
    Lozinka NVARCHAR(255) NOT NULL,
    Ime NVARCHAR(255) NULL,
    Prezime NVARCHAR(255) NULL,
    Aktivan BIT NOT NULL DEFAULT 1
);

-- Kreiranje tablice OperaterUloge
CREATE TABLE OperaterUloge (
    Sifra INT IDENTITY(1,1) PRIMARY KEY,
    Naziv NVARCHAR(50) NOT NULL,
    Opis NVARCHAR(255) NULL
);

-- Kreiranje tablice OperaterOperaterUloge
CREATE TABLE OperaterOperaterUloge (
    Sifra INT IDENTITY(1,1) PRIMARY KEY,
    OperaterId INT NOT NULL,
    OperaterUlogaId INT NOT NULL
);



create table proizvodi(
sifra int not null primary key identity(1,1), 
nazivigre varchar(100) not null, 
cijena decimal (18,2) not null
);

create table kupci(
sifra int not null primary key identity(1,1),
ime varchar(50) not null,
prezime varchar(100) not null,
ulica varchar(100) not null,
mjesto varchar(100) not null
);

create table racuni(
sifra int not null primary key identity(1,1),
datum datetime not null, -- "Datum kupnje" upotpunosti uklonjen iz table(stavke) jer prilikom izrade racuna vec imamo datum kupnje, odnosno dana kada se izdao racun.
kupac int not null references kupci(sifra)
);

create table stavke(
sifra int not null primary key identity(1,1),
racun int not null references racuni(sifra),
proizvod int not null references proizvodi(sifra),
kolicina int not null, 
cijena decimal (18,2) not null--datumkupnje datetime --v 0.1"Datumkupnje" prebacen iz table (proizvodi) u table (stavke) jer ce datum biti upisan kada se odredjeni proizvod kupi. 
);

--1
insert into proizvodi(nazivigre, cijena) values
('World of Tanks', 0.00),
('LOL', 0.00),
('PUBG', 21.99),
('FIFA', 99.99),
('RDR', 49.99);

--2
insert into kupci(ime,prezime,ulica,mjesto) values
--1
('Marko', 'Perić', 'Matice hrvatske 12', 'Vinkovci'),
--2
('Ivan','Marković','Ulica Kralja Zvonimira','Vinkovci'),
--3
('Martin','Vida', 'Duga ulica', 'Vinkovci'),
--4
('Željko','Baraban', 'Lapovačka 19', 'Vinkovci'),
--5
('Petar','Maj','Ružina ulica','Vinkovci');

--3
insert into racuni(datum, kupac) values
('2025-11-25', 1), -- Datum, prvi kupac
('2025-10-19', 3), -- itd
('2025-09-15', 2); 

--4
insert into stavke(racun, proizvod, kolicina, cijena) values
(1, 1, 2, 0.00), -- Prvi račun, prvi proizvod, 2 komada, cijena
(1, 3, 1, 21.99), -- itd
(2, 2, 3, 0.00); 


select * from proizvodi;
select * from kupci;
select * from racuni;
select * from stavke;