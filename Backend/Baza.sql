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

-- Dodavanje ograničenja duljine na tablicu proizvodi
-- ALTER TABLE proizvodi
-- ADD CONSTRAINT CK_Proizvodi_NazivIgre_Duljina
-- CHECK (LEN(nazivigre) <= 100);

-- Dodavanje ograničenja duljine na tablicu kupci
-- ALTER TABLE kupci
-- ADD CONSTRAINT CK_Kupci_Ime_Duljina
-- CHECK (LEN(ime) <= 50);

-- ALTER TABLE kupci
-- ADD CONSTRAINT CK_Kupci_Prezime_Duljina
-- CHECK (LEN(prezime) <= 100);

-- ALTER TABLE kupci
-- ADD CONSTRAINT CK_Kupci_Ulica_Duljina
-- CHECK (LEN(ulica) <= 100);

-- ALTER TABLE kupci
-- ADD CONSTRAINT CK_Kupci_Mjesto_Duljina
-- CHECK (LEN(mjesto) <= 100);

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