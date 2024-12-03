use master;
go
drop database if exists webkupovinaigrica;
go
create database webkupovinaigrica;
go
use webkupovinaigrica;
go

create table proizvodi(
sifra int not null primary key identity(1,1), 
nazivigre varchar(100) not null, 
cijena decimal (18,2) not null, 
datumkupnje datetime,
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
datum datetime not null,
kupac int not null references kupci(sifra)
);

create table stavke(
racun int not null references racuni(sifra),
proizvod int not null references proizvodi(sifra),
kolicina varchar (100) not null, 
cijena decimal (18,2) not null 
);