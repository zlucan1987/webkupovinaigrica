use master;
go
drop database if exists webkupovinaigrica;
go
create database webkupovinaigrica collate Croatian_CI_AS;
go
use webkupovinaigrica;
go

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
('Marko', 'Periæ', 'Matice hrvatske 12', 'Vinkovci'),
--2
('Ivan','Markoviæ','Ulica Kralja Zvonimira','Vinkovci'),
--3
('Martin','Vida', 'Duga ulica', 'Vinkovci'),
--4
('Željko','Baraban', 'Lapovaèka 19', 'Vinkovci'),
--5
('Petar','Maj','Ružina ulica','Vinkovci');

--3
insert into racuni(datum, kupac) values
('2025-11-25', 1), -- Datum, prvi kupac
('2025-10-19', 3), -- itd
('2025-09-15', 2); 

--4
insert into stavke(racun, proizvod, kolicina, cijena) values
(1, 1, 2, 0.00), -- Prvi raèun, prvi proizvod, 2 komada, cijena
(1, 3, 1, 21.99), -- itd
(2, 2, 3, 0.00); 


select * from proizvodi;
select * from kupci;
select * from racuni;
select * from stavke;