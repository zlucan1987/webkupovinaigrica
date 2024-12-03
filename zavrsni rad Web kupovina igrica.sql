use master;
go
drop database if exists webkupovinaigrica;
go
create database webkupovinaigrica;
go
use webkupovinaigrica;
go

create table proizvodi(
sifra int, 
nazivigre varchar(100), 
cijena decimal (18,2), 
datumkupnje datetime
);

create table stavke (
racun int,
proizvod varchar (100),
kolicina varchar (100), 
cijena decimal (18,2) 
);

create table racuni(
sifra int,
datum datetime,
kupac varchar(50),
);

create table kupci(
sifra int,
ime varchar(50),
prezime varchar(50),
ulica varchar(50),
mjesto varchar(50),
);
