<a name='assembly'></a>
# Backend

## Contents

- [AutentifikacijaController](#T-Backend-Controllers-AutentifikacijaController 'Backend.Controllers.AutentifikacijaController')
  - [#ctor(context,configuration,logger)](#M-Backend-Controllers-AutentifikacijaController-#ctor-Backend-Data-BackendContext,Microsoft-Extensions-Configuration-IConfiguration,Microsoft-Extensions-Logging-ILogger{Backend-Controllers-AutentifikacijaController}- 'Backend.Controllers.AutentifikacijaController.#ctor(Backend.Data.BackendContext,Microsoft.Extensions.Configuration.IConfiguration,Microsoft.Extensions.Logging.ILogger{Backend.Controllers.AutentifikacijaController})')
  - [ChangePassword(passwordDTO)](#M-Backend-Controllers-AutentifikacijaController-ChangePassword-Backend-Models-DTO-PasswordChangeDTO- 'Backend.Controllers.AutentifikacijaController.ChangePassword(Backend.Models.DTO.PasswordChangeDTO)')
  - [DeleteUser(id)](#M-Backend-Controllers-AutentifikacijaController-DeleteUser-System-Int32- 'Backend.Controllers.AutentifikacijaController.DeleteUser(System.Int32)')
  - [GenerateJwtToken(operater,uloge)](#M-Backend-Controllers-AutentifikacijaController-GenerateJwtToken-Backend-Models-Operater,System-Collections-Generic-List{System-String}- 'Backend.Controllers.AutentifikacijaController.GenerateJwtToken(Backend.Models.Operater,System.Collections.Generic.List{System.String})')
  - [GetUserDetails(id)](#M-Backend-Controllers-AutentifikacijaController-GetUserDetails-System-Int32- 'Backend.Controllers.AutentifikacijaController.GetUserDetails(System.Int32)')
  - [GetUsers()](#M-Backend-Controllers-AutentifikacijaController-GetUsers 'Backend.Controllers.AutentifikacijaController.GetUsers')
  - [IsPasswordStrong(password)](#M-Backend-Controllers-AutentifikacijaController-IsPasswordStrong-System-String- 'Backend.Controllers.AutentifikacijaController.IsPasswordStrong(System.String)')
  - [Login(operaterDTO)](#M-Backend-Controllers-AutentifikacijaController-Login-Backend-Models-DTO-OperaterDTO- 'Backend.Controllers.AutentifikacijaController.Login(Backend.Models.DTO.OperaterDTO)')
  - [Register(registerDTO)](#M-Backend-Controllers-AutentifikacijaController-Register-Backend-Models-DTO-OperaterRegisterDTO- 'Backend.Controllers.AutentifikacijaController.Register(Backend.Models.DTO.OperaterRegisterDTO)')
  - [ResetAdminPassword()](#M-Backend-Controllers-AutentifikacijaController-ResetAdminPassword 'Backend.Controllers.AutentifikacijaController.ResetAdminPassword')
  - [UpdateNickname(id,nicknameDTO)](#M-Backend-Controllers-AutentifikacijaController-UpdateNickname-System-Int32,Backend-Models-DTO-NicknameUpdateDTO- 'Backend.Controllers.AutentifikacijaController.UpdateNickname(System.Int32,Backend.Models.DTO.NicknameUpdateDTO)')
  - [UpdateUser(id,updateDTO)](#M-Backend-Controllers-AutentifikacijaController-UpdateUser-System-Int32,Backend-Models-DTO-OperaterUpdateDTO- 'Backend.Controllers.AutentifikacijaController.UpdateUser(System.Int32,Backend.Models.DTO.OperaterUpdateDTO)')
  - [UpdateUserRoles(id,updateRolesDTO)](#M-Backend-Controllers-AutentifikacijaController-UpdateUserRoles-System-Int32,Backend-Models-DTO-OperaterUpdateRolesDTO- 'Backend.Controllers.AutentifikacijaController.UpdateUserRoles(System.Int32,Backend.Models.DTO.OperaterUpdateRolesDTO)')
- [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController')
  - [#ctor(context)](#M-Backend-Controllers-AutorizacijaController-#ctor-Backend-Data-BackendContext- 'Backend.Controllers.AutorizacijaController.#ctor(Backend.Data.BackendContext)')
  - [_context](#F-Backend-Controllers-AutorizacijaController-_context 'Backend.Controllers.AutorizacijaController._context')
  - [GenerirajToken(operater)](#M-Backend-Controllers-AutorizacijaController-GenerirajToken-Backend-Models-DTO-OperaterDTO- 'Backend.Controllers.AutorizacijaController.GenerirajToken(Backend.Models.DTO.OperaterDTO)')
- [BackendExtensions](#T-Backend-Extensions-BackendExtensions 'Backend.Extensions.BackendExtensions')
  - [AddBackendCORS(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendCORS-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendCORS(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
  - [AddBackendSecurity(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendSecurity-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendSecurity(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
  - [AddBackendSwaggerGen(Services)](#M-Backend-Extensions-BackendExtensions-AddBackendSwaggerGen-Microsoft-Extensions-DependencyInjection-IServiceCollection- 'Backend.Extensions.BackendExtensions.AddBackendSwaggerGen(Microsoft.Extensions.DependencyInjection.IServiceCollection)')
- [DodajRacunSifraIProizvodSifraUStavku](#T-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku 'Backend.Migrations.DodajRacunSifraIProizvodSifraUStavku')
  - [BuildTargetModel()](#M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-BuildTargetModel-Microsoft-EntityFrameworkCore-ModelBuilder- 'Backend.Migrations.DodajRacunSifraIProizvodSifraUStavku.BuildTargetModel(Microsoft.EntityFrameworkCore.ModelBuilder)')
  - [Down()](#M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-Down-Microsoft-EntityFrameworkCore-Migrations-MigrationBuilder- 'Backend.Migrations.DodajRacunSifraIProizvodSifraUStavku.Down(Microsoft.EntityFrameworkCore.Migrations.MigrationBuilder)')
  - [Up()](#M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-Up-Microsoft-EntityFrameworkCore-Migrations-MigrationBuilder- 'Backend.Migrations.DodajRacunSifraIProizvodSifraUStavku.Up(Microsoft.EntityFrameworkCore.Migrations.MigrationBuilder)')
- [KupacController](#T-Backend-Controllers-KupacController 'Backend.Controllers.KupacController')
  - [Delete(sifra)](#M-Backend-Controllers-KupacController-Delete-System-Int32- 'Backend.Controllers.KupacController.Delete(System.Int32)')
  - [Generiraj(broj)](#M-Backend-Controllers-KupacController-Generiraj-System-Int32- 'Backend.Controllers.KupacController.Generiraj(System.Int32)')
  - [Get()](#M-Backend-Controllers-KupacController-Get 'Backend.Controllers.KupacController.Get')
  - [Get(sifra)](#M-Backend-Controllers-KupacController-Get-System-Int32- 'Backend.Controllers.KupacController.Get(System.Int32)')
  - [Post(kupacDTO)](#M-Backend-Controllers-KupacController-Post-Backend-Models-DTO-KupacDTOInsertUpdate- 'Backend.Controllers.KupacController.Post(Backend.Models.DTO.KupacDTOInsertUpdate)')
  - [Put(sifra,kupacDTO)](#M-Backend-Controllers-KupacController-Put-System-Int32,Backend-Models-DTO-KupacDTOInsertUpdate- 'Backend.Controllers.KupacController.Put(System.Int32,Backend.Models.DTO.KupacDTOInsertUpdate)')
  - [TraziKupac(uvjet)](#M-Backend-Controllers-KupacController-TraziKupac-System-String- 'Backend.Controllers.KupacController.TraziKupac(System.String)')
  - [TraziKupacStranicenje(stranica,uvjet)](#M-Backend-Controllers-KupacController-TraziKupacStranicenje-System-Int32,System-String- 'Backend.Controllers.KupacController.TraziKupacStranicenje(System.Int32,System.String)')
- [NicknameUpdateDTO](#T-Backend-Models-DTO-NicknameUpdateDTO 'Backend.Models.DTO.NicknameUpdateDTO')
  - [Locked](#P-Backend-Models-DTO-NicknameUpdateDTO-Locked 'Backend.Models.DTO.NicknameUpdateDTO.Locked')
  - [Nickname](#P-Backend-Models-DTO-NicknameUpdateDTO-Nickname 'Backend.Models.DTO.NicknameUpdateDTO.Nickname')
- [Operater](#T-Backend-Models-Operater 'Backend.Models.Operater')
  - [Aktivan](#P-Backend-Models-Operater-Aktivan 'Backend.Models.Operater.Aktivan')
  - [DatumKreiranja](#P-Backend-Models-Operater-DatumKreiranja 'Backend.Models.Operater.DatumKreiranja')
  - [DatumZakljucavanja](#P-Backend-Models-Operater-DatumZakljucavanja 'Backend.Models.Operater.DatumZakljucavanja')
  - [Ime](#P-Backend-Models-Operater-Ime 'Backend.Models.Operater.Ime')
  - [KorisnickoIme](#P-Backend-Models-Operater-KorisnickoIme 'Backend.Models.Operater.KorisnickoIme')
  - [Lozinka](#P-Backend-Models-Operater-Lozinka 'Backend.Models.Operater.Lozinka')
  - [NeuspjeliPokusajiPrijave](#P-Backend-Models-Operater-NeuspjeliPokusajiPrijave 'Backend.Models.Operater.NeuspjeliPokusajiPrijave')
  - [Nickname](#P-Backend-Models-Operater-Nickname 'Backend.Models.Operater.Nickname')
  - [NicknameLocked](#P-Backend-Models-Operater-NicknameLocked 'Backend.Models.Operater.NicknameLocked')
  - [OperaterOperaterUloge](#P-Backend-Models-Operater-OperaterOperaterUloge 'Backend.Models.Operater.OperaterOperaterUloge')
  - [Prezime](#P-Backend-Models-Operater-Prezime 'Backend.Models.Operater.Prezime')
  - [ZadnjaPromjenaLozinke](#P-Backend-Models-Operater-ZadnjaPromjenaLozinke 'Backend.Models.Operater.ZadnjaPromjenaLozinke')
- [OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO')
  - [#ctor(KorisnickoIme,Password)](#M-Backend-Models-DTO-OperaterDTO-#ctor-System-String,System-String- 'Backend.Models.DTO.OperaterDTO.#ctor(System.String,System.String)')
  - [KorisnickoIme](#P-Backend-Models-DTO-OperaterDTO-KorisnickoIme 'Backend.Models.DTO.OperaterDTO.KorisnickoIme')
  - [Password](#P-Backend-Models-DTO-OperaterDTO-Password 'Backend.Models.DTO.OperaterDTO.Password')
- [OperaterDetailsDTO](#T-Backend-Models-DTO-OperaterDetailsDTO 'Backend.Models.DTO.OperaterDetailsDTO')
  - [Aktivan](#P-Backend-Models-DTO-OperaterDetailsDTO-Aktivan 'Backend.Models.DTO.OperaterDetailsDTO.Aktivan')
  - [DatumKreiranja](#P-Backend-Models-DTO-OperaterDetailsDTO-DatumKreiranja 'Backend.Models.DTO.OperaterDetailsDTO.DatumKreiranja')
  - [Id](#P-Backend-Models-DTO-OperaterDetailsDTO-Id 'Backend.Models.DTO.OperaterDetailsDTO.Id')
  - [Ime](#P-Backend-Models-DTO-OperaterDetailsDTO-Ime 'Backend.Models.DTO.OperaterDetailsDTO.Ime')
  - [KorisnickoIme](#P-Backend-Models-DTO-OperaterDetailsDTO-KorisnickoIme 'Backend.Models.DTO.OperaterDetailsDTO.KorisnickoIme')
  - [Nickname](#P-Backend-Models-DTO-OperaterDetailsDTO-Nickname 'Backend.Models.DTO.OperaterDetailsDTO.Nickname')
  - [NicknameLocked](#P-Backend-Models-DTO-OperaterDetailsDTO-NicknameLocked 'Backend.Models.DTO.OperaterDetailsDTO.NicknameLocked')
  - [Prezime](#P-Backend-Models-DTO-OperaterDetailsDTO-Prezime 'Backend.Models.DTO.OperaterDetailsDTO.Prezime')
  - [Uloge](#P-Backend-Models-DTO-OperaterDetailsDTO-Uloge 'Backend.Models.DTO.OperaterDetailsDTO.Uloge')
  - [ZadnjaPromjenaLozinke](#P-Backend-Models-DTO-OperaterDetailsDTO-ZadnjaPromjenaLozinke 'Backend.Models.DTO.OperaterDetailsDTO.ZadnjaPromjenaLozinke')
- [OperaterOperaterUloga](#T-Backend-Models-OperaterOperaterUloga 'Backend.Models.OperaterOperaterUloga')
  - [Operater](#P-Backend-Models-OperaterOperaterUloga-Operater 'Backend.Models.OperaterOperaterUloga.Operater')
  - [OperaterId](#P-Backend-Models-OperaterOperaterUloga-OperaterId 'Backend.Models.OperaterOperaterUloga.OperaterId')
  - [OperaterUloga](#P-Backend-Models-OperaterOperaterUloga-OperaterUloga 'Backend.Models.OperaterOperaterUloga.OperaterUloga')
  - [OperaterUlogaId](#P-Backend-Models-OperaterOperaterUloga-OperaterUlogaId 'Backend.Models.OperaterOperaterUloga.OperaterUlogaId')
- [OperaterReadDTO](#T-Backend-Models-DTO-OperaterReadDTO 'Backend.Models.DTO.OperaterReadDTO')
  - [Aktivan](#P-Backend-Models-DTO-OperaterReadDTO-Aktivan 'Backend.Models.DTO.OperaterReadDTO.Aktivan')
  - [Id](#P-Backend-Models-DTO-OperaterReadDTO-Id 'Backend.Models.DTO.OperaterReadDTO.Id')
  - [Ime](#P-Backend-Models-DTO-OperaterReadDTO-Ime 'Backend.Models.DTO.OperaterReadDTO.Ime')
  - [KorisnickoIme](#P-Backend-Models-DTO-OperaterReadDTO-KorisnickoIme 'Backend.Models.DTO.OperaterReadDTO.KorisnickoIme')
  - [Nickname](#P-Backend-Models-DTO-OperaterReadDTO-Nickname 'Backend.Models.DTO.OperaterReadDTO.Nickname')
  - [NicknameLocked](#P-Backend-Models-DTO-OperaterReadDTO-NicknameLocked 'Backend.Models.DTO.OperaterReadDTO.NicknameLocked')
  - [Prezime](#P-Backend-Models-DTO-OperaterReadDTO-Prezime 'Backend.Models.DTO.OperaterReadDTO.Prezime')
  - [Uloge](#P-Backend-Models-DTO-OperaterReadDTO-Uloge 'Backend.Models.DTO.OperaterReadDTO.Uloge')
- [OperaterRegisterDTO](#T-Backend-Models-DTO-OperaterRegisterDTO 'Backend.Models.DTO.OperaterRegisterDTO')
  - [Ime](#P-Backend-Models-DTO-OperaterRegisterDTO-Ime 'Backend.Models.DTO.OperaterRegisterDTO.Ime')
  - [KorisnickoIme](#P-Backend-Models-DTO-OperaterRegisterDTO-KorisnickoIme 'Backend.Models.DTO.OperaterRegisterDTO.KorisnickoIme')
  - [Lozinka](#P-Backend-Models-DTO-OperaterRegisterDTO-Lozinka 'Backend.Models.DTO.OperaterRegisterDTO.Lozinka')
  - [Prezime](#P-Backend-Models-DTO-OperaterRegisterDTO-Prezime 'Backend.Models.DTO.OperaterRegisterDTO.Prezime')
- [OperaterUloga](#T-Backend-Models-OperaterUloga 'Backend.Models.OperaterUloga')
  - [Naziv](#P-Backend-Models-OperaterUloga-Naziv 'Backend.Models.OperaterUloga.Naziv')
  - [OperaterOperaterUloge](#P-Backend-Models-OperaterUloga-OperaterOperaterUloge 'Backend.Models.OperaterUloga.OperaterOperaterUloge')
  - [Opis](#P-Backend-Models-OperaterUloga-Opis 'Backend.Models.OperaterUloga.Opis')
- [OperaterUlogaDTO](#T-Backend-Models-DTO-OperaterUlogaDTO 'Backend.Models.DTO.OperaterUlogaDTO')
  - [Id](#P-Backend-Models-DTO-OperaterUlogaDTO-Id 'Backend.Models.DTO.OperaterUlogaDTO.Id')
  - [Naziv](#P-Backend-Models-DTO-OperaterUlogaDTO-Naziv 'Backend.Models.DTO.OperaterUlogaDTO.Naziv')
  - [Opis](#P-Backend-Models-DTO-OperaterUlogaDTO-Opis 'Backend.Models.DTO.OperaterUlogaDTO.Opis')
- [OperaterUpdateDTO](#T-Backend-Models-DTO-OperaterUpdateDTO 'Backend.Models.DTO.OperaterUpdateDTO')
  - [Ime](#P-Backend-Models-DTO-OperaterUpdateDTO-Ime 'Backend.Models.DTO.OperaterUpdateDTO.Ime')
  - [KorisnickoIme](#P-Backend-Models-DTO-OperaterUpdateDTO-KorisnickoIme 'Backend.Models.DTO.OperaterUpdateDTO.KorisnickoIme')
  - [Prezime](#P-Backend-Models-DTO-OperaterUpdateDTO-Prezime 'Backend.Models.DTO.OperaterUpdateDTO.Prezime')
- [OperaterUpdateRolesDTO](#T-Backend-Models-DTO-OperaterUpdateRolesDTO 'Backend.Models.DTO.OperaterUpdateRolesDTO')
  - [OperaterId](#P-Backend-Models-DTO-OperaterUpdateRolesDTO-OperaterId 'Backend.Models.DTO.OperaterUpdateRolesDTO.OperaterId')
  - [Uloge](#P-Backend-Models-DTO-OperaterUpdateRolesDTO-Uloge 'Backend.Models.DTO.OperaterUpdateRolesDTO.Uloge')
- [PasswordChangeDTO](#T-Backend-Models-DTO-PasswordChangeDTO 'Backend.Models.DTO.PasswordChangeDTO')
  - [NovaLozinka](#P-Backend-Models-DTO-PasswordChangeDTO-NovaLozinka 'Backend.Models.DTO.PasswordChangeDTO.NovaLozinka')
  - [TrenutnaLozinka](#P-Backend-Models-DTO-PasswordChangeDTO-TrenutnaLozinka 'Backend.Models.DTO.PasswordChangeDTO.TrenutnaLozinka')
- [PocetnaController](#T-Backend-Controllers-PocetnaController 'Backend.Controllers.PocetnaController')
  - [#ctor(_context)](#M-Backend-Controllers-PocetnaController-#ctor-Backend-Data-BackendContext- 'Backend.Controllers.PocetnaController.#ctor(Backend.Data.BackendContext)')
  - [DostupneStavke()](#M-Backend-Controllers-PocetnaController-DostupneStavke 'Backend.Controllers.PocetnaController.DostupneStavke')
  - [GrafPodaci()](#M-Backend-Controllers-PocetnaController-GrafPodaci 'Backend.Controllers.PocetnaController.GrafPodaci')
  - [UkupnoKupaca()](#M-Backend-Controllers-PocetnaController-UkupnoKupaca 'Backend.Controllers.PocetnaController.UkupnoKupaca')
- [ProizvodController](#T-Backend-Controllers-ProizvodController 'Backend.Controllers.ProizvodController')
  - [#ctor(context,mapper)](#M-Backend-Controllers-ProizvodController-#ctor-Backend-Data-BackendContext,AutoMapper-IMapper- 'Backend.Controllers.ProizvodController.#ctor(Backend.Data.BackendContext,AutoMapper.IMapper)')
  - [Delete(sifra)](#M-Backend-Controllers-ProizvodController-Delete-System-Int32- 'Backend.Controllers.ProizvodController.Delete(System.Int32)')
  - [DohvatiPodatkeZaGraf()](#M-Backend-Controllers-ProizvodController-DohvatiPodatkeZaGraf 'Backend.Controllers.ProizvodController.DohvatiPodatkeZaGraf')
  - [Get()](#M-Backend-Controllers-ProizvodController-Get 'Backend.Controllers.ProizvodController.Get')
  - [Get(sifra)](#M-Backend-Controllers-ProizvodController-Get-System-Int32- 'Backend.Controllers.ProizvodController.Get(System.Int32)')
  - [Post(proizvodDTO)](#M-Backend-Controllers-ProizvodController-Post-Backend-Models-DTO-ProizvodDTOInsertUpdate- 'Backend.Controllers.ProizvodController.Post(Backend.Models.DTO.ProizvodDTOInsertUpdate)')
  - [PostaviSliku(sifra,slika)](#M-Backend-Controllers-ProizvodController-PostaviSliku-System-Int32,Backend-Models-DTO-SlikaDTO- 'Backend.Controllers.ProizvodController.PostaviSliku(System.Int32,Backend.Models.DTO.SlikaDTO)')
  - [Put(sifra,proizvodDTO)](#M-Backend-Controllers-ProizvodController-Put-System-Int32,Backend-Models-DTO-ProizvodDTOInsertUpdate- 'Backend.Controllers.ProizvodController.Put(System.Int32,Backend.Models.DTO.ProizvodDTOInsertUpdate)')
- [RacunController](#T-Backend-Controllers-RacunController 'Backend.Controllers.RacunController')
  - [Delete(sifra)](#M-Backend-Controllers-RacunController-Delete-System-Int32- 'Backend.Controllers.RacunController.Delete(System.Int32)')
  - [DodajStavku(sifraRacuna,stavkaDTO)](#M-Backend-Controllers-RacunController-DodajStavku-System-Int32,Backend-Models-DTO-StavkaDTOInsert- 'Backend.Controllers.RacunController.DodajStavku(System.Int32,Backend.Models.DTO.StavkaDTOInsert)')
  - [Get()](#M-Backend-Controllers-RacunController-Get 'Backend.Controllers.RacunController.Get')
  - [Get(sifra)](#M-Backend-Controllers-RacunController-Get-System-Int32- 'Backend.Controllers.RacunController.Get(System.Int32)')
  - [GetStavkeRacuna(sifraRacuna)](#M-Backend-Controllers-RacunController-GetStavkeRacuna-System-Int32- 'Backend.Controllers.RacunController.GetStavkeRacuna(System.Int32)')
  - [IzmijeniStavku(sifraRacuna,sifraStavke,stavkaDTO)](#M-Backend-Controllers-RacunController-IzmijeniStavku-System-Int32,System-Int32,Backend-Models-DTO-StavkaDTOUpdate- 'Backend.Controllers.RacunController.IzmijeniStavku(System.Int32,System.Int32,Backend.Models.DTO.StavkaDTOUpdate)')
  - [ObrisiStavku(sifraRacuna,sifraStavke)](#M-Backend-Controllers-RacunController-ObrisiStavku-System-Int32,System-Int32- 'Backend.Controllers.RacunController.ObrisiStavku(System.Int32,System.Int32)')
  - [Post(racunDTO)](#M-Backend-Controllers-RacunController-Post-Backend-Models-DTO-RacunDTOInsertUpdate- 'Backend.Controllers.RacunController.Post(Backend.Models.DTO.RacunDTOInsertUpdate)')
  - [Put(sifra,racunDTO)](#M-Backend-Controllers-RacunController-Put-System-Int32,Backend-Models-DTO-RacunDTOInsertUpdate- 'Backend.Controllers.RacunController.Put(System.Int32,Backend.Models.DTO.RacunDTOInsertUpdate)')
- [SlikaDTO](#T-Backend-Models-DTO-SlikaDTO 'Backend.Models.DTO.SlikaDTO')
  - [#ctor(Base64)](#M-Backend-Models-DTO-SlikaDTO-#ctor-System-String- 'Backend.Models.DTO.SlikaDTO.#ctor(System.String)')
  - [Base64](#P-Backend-Models-DTO-SlikaDTO-Base64 'Backend.Models.DTO.SlikaDTO.Base64')

<a name='T-Backend-Controllers-AutentifikacijaController'></a>
## AutentifikacijaController `type`

##### Namespace

Backend.Controllers

##### Summary

Kontroler za autentifikaciju i upravljanje korisnicima.

<a name='M-Backend-Controllers-AutentifikacijaController-#ctor-Backend-Data-BackendContext,Microsoft-Extensions-Configuration-IConfiguration,Microsoft-Extensions-Logging-ILogger{Backend-Controllers-AutentifikacijaController}-'></a>
### #ctor(context,configuration,logger) `constructor`

##### Summary

Konstruktor za AutentifikacijaController.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [Backend.Data.BackendContext](#T-Backend-Data-BackendContext 'Backend.Data.BackendContext') | Kontekst baze podataka. |
| configuration | [Microsoft.Extensions.Configuration.IConfiguration](#T-Microsoft-Extensions-Configuration-IConfiguration 'Microsoft.Extensions.Configuration.IConfiguration') | Konfiguracija aplikacije. |
| logger | [Microsoft.Extensions.Logging.ILogger{Backend.Controllers.AutentifikacijaController}](#T-Microsoft-Extensions-Logging-ILogger{Backend-Controllers-AutentifikacijaController} 'Microsoft.Extensions.Logging.ILogger{Backend.Controllers.AutentifikacijaController}') | Logger za bilježenje događaja. |

<a name='M-Backend-Controllers-AutentifikacijaController-ChangePassword-Backend-Models-DTO-PasswordChangeDTO-'></a>
### ChangePassword(passwordDTO) `method`

##### Summary

Promjena lozinke korisnika.

##### Returns

Rezultat promjene lozinke.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| passwordDTO | [Backend.Models.DTO.PasswordChangeDTO](#T-Backend-Models-DTO-PasswordChangeDTO 'Backend.Models.DTO.PasswordChangeDTO') | Podaci za promjenu lozinke. |

##### Remarks

Primjer zahtjeva:

     POST /api/v1/Autentifikacija/ChangePassword
     {
        "trenutnaLozinka": "StariPassword1!",
        "novaLozinka": "NoviPassword2@"
     }

<a name='M-Backend-Controllers-AutentifikacijaController-DeleteUser-System-Int32-'></a>
### DeleteUser(id) `method`

##### Summary

Briše korisnika iz sustava.

##### Returns

Rezultat brisanja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | ID korisnika kojeg treba obrisati. |

##### Remarks

Primjer zahtjeva:

     DELETE /api/v1/Autentifikacija/Users/1

<a name='M-Backend-Controllers-AutentifikacijaController-GenerateJwtToken-Backend-Models-Operater,System-Collections-Generic-List{System-String}-'></a>
### GenerateJwtToken(operater,uloge) `method`

##### Summary

Generira JWT token za korisnika.

##### Returns

JWT token.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operater | [Backend.Models.Operater](#T-Backend-Models-Operater 'Backend.Models.Operater') | Operater za kojeg se generira token. |
| uloge | [System.Collections.Generic.List{System.String}](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Collections.Generic.List 'System.Collections.Generic.List{System.String}') | Uloge operatera. |

<a name='M-Backend-Controllers-AutentifikacijaController-GetUserDetails-System-Int32-'></a>
### GetUserDetails(id) `method`

##### Summary

Dohvaća detalje o korisniku.

##### Returns

Detalji o korisniku.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | ID korisnika. |

##### Remarks

Primjer zahtjeva:

     GET /api/v1/Autentifikacija/Users/1/Details

<a name='M-Backend-Controllers-AutentifikacijaController-GetUsers'></a>
### GetUsers() `method`

##### Summary

Dohvaća sve korisnike.

##### Returns

Lista korisnika.

##### Parameters

This method has no parameters.

##### Remarks

Primjer zahtjeva:

     GET /api/v1/Autentifikacija/Users

<a name='M-Backend-Controllers-AutentifikacijaController-IsPasswordStrong-System-String-'></a>
### IsPasswordStrong(password) `method`

##### Summary

Provjera složenosti lozinke.

##### Returns

True ako je lozinka dovoljno jaka, inače false.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| password | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Lozinka za provjeru. |

<a name='M-Backend-Controllers-AutentifikacijaController-Login-Backend-Models-DTO-OperaterDTO-'></a>
### Login(operaterDTO) `method`

##### Summary

Prijava korisnika i generiranje JWT tokena.

##### Returns

JWT token ako je prijava uspješna, inače 403 Forbidden.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operaterDTO | [Backend.Models.DTO.OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO') | Podaci za prijavu. |

##### Remarks

Primjer zahtjeva:

     POST /api/v1/Autentifikacija/Login
     {
        "korisnickoIme": "admin@admin.com",
        "password": "admin123"
     }

<a name='M-Backend-Controllers-AutentifikacijaController-Register-Backend-Models-DTO-OperaterRegisterDTO-'></a>
### Register(registerDTO) `method`

##### Summary

Registracija novog korisnika.

##### Returns

Rezultat registracije.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| registerDTO | [Backend.Models.DTO.OperaterRegisterDTO](#T-Backend-Models-DTO-OperaterRegisterDTO 'Backend.Models.DTO.OperaterRegisterDTO') | Podaci za registraciju. |

##### Remarks

Primjer zahtjeva:

     POST /api/v1/Autentifikacija/Register
     {
        "korisnickoIme": "novi.korisnik@example.com",
        "lozinka": "Lozinka1!",
        "ime": "Novi",
        "prezime": "Korisnik"
     }

<a name='M-Backend-Controllers-AutentifikacijaController-ResetAdminPassword'></a>
### ResetAdminPassword() `method`

##### Summary

Resetira lozinku admin korisnika ili kreira novog admin korisnika ako ne postoji.

##### Returns

Rezultat resetiranja lozinke ili kreiranja admin korisnika.

##### Parameters

This method has no parameters.

##### Remarks

Primjer zahtjeva:

     POST /api/v1/Autentifikacija/ResetAdminPassword

<a name='M-Backend-Controllers-AutentifikacijaController-UpdateNickname-System-Int32,Backend-Models-DTO-NicknameUpdateDTO-'></a>
### UpdateNickname(id,nicknameDTO) `method`

##### Summary

Ažurira nadimak korisnika.

##### Returns

Rezultat ažuriranja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | ID korisnika. |
| nicknameDTO | [Backend.Models.DTO.NicknameUpdateDTO](#T-Backend-Models-DTO-NicknameUpdateDTO 'Backend.Models.DTO.NicknameUpdateDTO') | Podaci za ažuriranje nadimka. |

##### Remarks

Primjer zahtjeva:

     PUT /api/v1/Autentifikacija/Users/1/Nickname
     {
        "nickname": "CoolGamer123",
        "locked": true
     }

<a name='M-Backend-Controllers-AutentifikacijaController-UpdateUser-System-Int32,Backend-Models-DTO-OperaterUpdateDTO-'></a>
### UpdateUser(id,updateDTO) `method`

##### Summary

Ažurira podatke o korisniku.

##### Returns

Rezultat ažuriranja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | ID korisnika. |
| updateDTO | [Backend.Models.DTO.OperaterUpdateDTO](#T-Backend-Models-DTO-OperaterUpdateDTO 'Backend.Models.DTO.OperaterUpdateDTO') | Podaci za ažuriranje. |

##### Remarks

Primjer zahtjeva:

     PUT /api/v1/Autentifikacija/Users/1
     {
        "ime": "Ažurirano",
        "prezime": "Prezime",
        "korisnickoIme": "azurirano.prezime@example.com"
     }

<a name='M-Backend-Controllers-AutentifikacijaController-UpdateUserRoles-System-Int32,Backend-Models-DTO-OperaterUpdateRolesDTO-'></a>
### UpdateUserRoles(id,updateRolesDTO) `method`

##### Summary

Ažurira uloge korisnika.

##### Returns

Rezultat ažuriranja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | ID korisnika. |
| updateRolesDTO | [Backend.Models.DTO.OperaterUpdateRolesDTO](#T-Backend-Models-DTO-OperaterUpdateRolesDTO 'Backend.Models.DTO.OperaterUpdateRolesDTO') | Podaci za ažuriranje uloga. |

##### Remarks

Primjer zahtjeva:

     PUT /api/v1/Autentifikacija/Users/1/Roles
     {
        "operaterId": 1,
        "uloge": ["User", "Admin"]
     }

<a name='T-Backend-Controllers-AutorizacijaController'></a>
## AutorizacijaController `type`

##### Namespace

Backend.Controllers

##### Summary

Kontroler za autorizaciju korisnika.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [T:Backend.Controllers.AutorizacijaController](#T-T-Backend-Controllers-AutorizacijaController 'T:Backend.Controllers.AutorizacijaController') | Kontekst baze podataka. |

##### Remarks

Inicijalizira novu instancu klase [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController').

<a name='M-Backend-Controllers-AutorizacijaController-#ctor-Backend-Data-BackendContext-'></a>
### #ctor(context) `constructor`

##### Summary

Kontroler za autorizaciju korisnika.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [Backend.Data.BackendContext](#T-Backend-Data-BackendContext 'Backend.Data.BackendContext') | Kontekst baze podataka. |

##### Remarks

Inicijalizira novu instancu klase [AutorizacijaController](#T-Backend-Controllers-AutorizacijaController 'Backend.Controllers.AutorizacijaController').

<a name='F-Backend-Controllers-AutorizacijaController-_context'></a>
### _context `constants`

##### Summary

Kontekst baze podataka

<a name='M-Backend-Controllers-AutorizacijaController-GenerirajToken-Backend-Models-DTO-OperaterDTO-'></a>
### GenerirajToken(operater) `method`

##### Summary

Generira token za autorizaciju.

##### Returns

JWT token ako je autorizacija uspješna, inače vraća status 403.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operater | [Backend.Models.DTO.OperaterDTO](#T-Backend-Models-DTO-OperaterDTO 'Backend.Models.DTO.OperaterDTO') | DTO objekt koji sadrži korisničko ime i lozinku operatera. |

##### Remarks

Primjer zahtjeva:

```json
{
   "korisnickoIme": "edunova@edunova.hr",
   "password": "edunova"
}
```

<a name='T-Backend-Extensions-BackendExtensions'></a>
## BackendExtensions `type`

##### Namespace

Backend.Extensions

##### Summary

Klasa koja sadrži proširenja za Backend aplikaciju.

<a name='M-Backend-Extensions-BackendExtensions-AddBackendCORS-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendCORS(Services) `method`

##### Summary

Dodaje konfiguraciju za CORS.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='M-Backend-Extensions-BackendExtensions-AddBackendSecurity-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendSecurity(Services) `method`

##### Summary

Dodaje konfiguraciju za sigurnost.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='M-Backend-Extensions-BackendExtensions-AddBackendSwaggerGen-Microsoft-Extensions-DependencyInjection-IServiceCollection-'></a>
### AddBackendSwaggerGen(Services) `method`

##### Summary

Dodaje konfiguraciju za Swagger dokumentaciju.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Services | [Microsoft.Extensions.DependencyInjection.IServiceCollection](#T-Microsoft-Extensions-DependencyInjection-IServiceCollection 'Microsoft.Extensions.DependencyInjection.IServiceCollection') | Instanca IServiceCollection. |

<a name='T-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku'></a>
## DodajRacunSifraIProizvodSifraUStavku `type`

##### Namespace

Backend.Migrations

##### Summary

*Inherit from parent.*

<a name='M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-BuildTargetModel-Microsoft-EntityFrameworkCore-ModelBuilder-'></a>
### BuildTargetModel() `method`

##### Summary

*Inherit from parent.*

##### Parameters

This method has no parameters.

<a name='M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-Down-Microsoft-EntityFrameworkCore-Migrations-MigrationBuilder-'></a>
### Down() `method`

##### Summary

*Inherit from parent.*

##### Parameters

This method has no parameters.

<a name='M-Backend-Migrations-DodajRacunSifraIProizvodSifraUStavku-Up-Microsoft-EntityFrameworkCore-Migrations-MigrationBuilder-'></a>
### Up() `method`

##### Summary

*Inherit from parent.*

##### Parameters

This method has no parameters.

<a name='T-Backend-Controllers-KupacController'></a>
## KupacController `type`

##### Namespace

Backend.Controllers

<a name='M-Backend-Controllers-KupacController-Delete-System-Int32-'></a>
### Delete(sifra) `method`

##### Summary

Briše kupca.

##### Returns

Status brisanja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra kupca. |

<a name='M-Backend-Controllers-KupacController-Generiraj-System-Int32-'></a>
### Generiraj(broj) `method`

##### Summary

Generira kupce.

##### Returns

Status generiranja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| broj | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Broj kupaca za generiranje. |

<a name='M-Backend-Controllers-KupacController-Get'></a>
### Get() `method`

##### Summary

Dohvaća sve kupce.

##### Returns

Lista kupaca.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-KupacController-Get-System-Int32-'></a>
### Get(sifra) `method`

##### Summary

Dohvaća kupca prema šifri.

##### Returns

Kupac s traženom šifrom.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra kupca. |

<a name='M-Backend-Controllers-KupacController-Post-Backend-Models-DTO-KupacDTOInsertUpdate-'></a>
### Post(kupacDTO) `method`

##### Summary

Dodaje novog kupca.

##### Returns

Dodani kupac.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| kupacDTO | [Backend.Models.DTO.KupacDTOInsertUpdate](#T-Backend-Models-DTO-KupacDTOInsertUpdate 'Backend.Models.DTO.KupacDTOInsertUpdate') | Podaci o kupcu. |

<a name='M-Backend-Controllers-KupacController-Put-System-Int32,Backend-Models-DTO-KupacDTOInsertUpdate-'></a>
### Put(sifra,kupacDTO) `method`

##### Summary

Ažurira postojećeg kupca.

##### Returns

Ažurirani kupac.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra kupca. |
| kupacDTO | [Backend.Models.DTO.KupacDTOInsertUpdate](#T-Backend-Models-DTO-KupacDTOInsertUpdate 'Backend.Models.DTO.KupacDTOInsertUpdate') | Podaci o kupcu. |

<a name='M-Backend-Controllers-KupacController-TraziKupac-System-String-'></a>
### TraziKupac(uvjet) `method`

##### Summary

Traži kupce prema uvjetu.

##### Returns

Lista kupaca.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| uvjet | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Uvjet pretrage. |

<a name='M-Backend-Controllers-KupacController-TraziKupacStranicenje-System-Int32,System-String-'></a>
### TraziKupacStranicenje(stranica,uvjet) `method`

##### Summary

Traži kupce s paginacijom.

##### Returns

Lista kupaca.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| stranica | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Broj stranice. |
| uvjet | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Uvjet pretrage. |

<a name='T-Backend-Models-DTO-NicknameUpdateDTO'></a>
## NicknameUpdateDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za ažuriranje nadimka operatera.

<a name='P-Backend-Models-DTO-NicknameUpdateDTO-Locked'></a>
### Locked `property`

##### Summary

Označava treba li zaključati nadimak (korisnik ga ne može mijenjati)

<a name='P-Backend-Models-DTO-NicknameUpdateDTO-Nickname'></a>
### Nickname `property`

##### Summary

Novi nadimak operatera

<a name='T-Backend-Models-Operater'></a>
## Operater `type`

##### Namespace

Backend.Models

##### Summary

Model operatera (korisnika) u sustavu

<a name='P-Backend-Models-Operater-Aktivan'></a>
### Aktivan `property`

##### Summary

Status aktivnosti operatera

<a name='P-Backend-Models-Operater-DatumKreiranja'></a>
### DatumKreiranja `property`

##### Summary

Datum kreiranja korisničkog računa

<a name='P-Backend-Models-Operater-DatumZakljucavanja'></a>
### DatumZakljucavanja `property`

##### Summary

Datum i vrijeme zaključavanja računa zbog previše neuspjelih pokušaja prijave

<a name='P-Backend-Models-Operater-Ime'></a>
### Ime `property`

##### Summary

Ime operatera

<a name='P-Backend-Models-Operater-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera (email adresa)

<a name='P-Backend-Models-Operater-Lozinka'></a>
### Lozinka `property`

##### Summary

Lozinka operatera (hashirana)

<a name='P-Backend-Models-Operater-NeuspjeliPokusajiPrijave'></a>
### NeuspjeliPokusajiPrijave `property`

##### Summary

Broj neuspjelih pokušaja prijave

<a name='P-Backend-Models-Operater-Nickname'></a>
### Nickname `property`

##### Summary

Nadimak korisnika koji se prikazuje javno

<a name='P-Backend-Models-Operater-NicknameLocked'></a>
### NicknameLocked `property`

##### Summary

Označava je li nadimak zaključan (korisnik ga ne može mijenjati)

<a name='P-Backend-Models-Operater-OperaterOperaterUloge'></a>
### OperaterOperaterUloge `property`

##### Summary

Veza s ulogama (many-to-many)

<a name='P-Backend-Models-Operater-Prezime'></a>
### Prezime `property`

##### Summary

Prezime operatera

<a name='P-Backend-Models-Operater-ZadnjaPromjenaLozinke'></a>
### ZadnjaPromjenaLozinke `property`

##### Summary

Datum i vrijeme zadnje promjene lozinke

<a name='T-Backend-Models-DTO-OperaterDTO'></a>
## OperaterDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO (Data Transfer Object) za operatera.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| KorisnickoIme | [T:Backend.Models.DTO.OperaterDTO](#T-T-Backend-Models-DTO-OperaterDTO 'T:Backend.Models.DTO.OperaterDTO') | Korisničko ime operatera |

<a name='M-Backend-Models-DTO-OperaterDTO-#ctor-System-String,System-String-'></a>
### #ctor(KorisnickoIme,Password) `constructor`

##### Summary

DTO (Data Transfer Object) za operatera.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| KorisnickoIme | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Korisničko ime operatera |
| Password | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Lozinka operatera |

<a name='P-Backend-Models-DTO-OperaterDTO-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera

<a name='P-Backend-Models-DTO-OperaterDTO-Password'></a>
### Password `property`

##### Summary

Lozinka operatera

<a name='T-Backend-Models-DTO-OperaterDetailsDTO'></a>
## OperaterDetailsDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za detaljne podatke o operateru.

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Aktivan'></a>
### Aktivan `property`

##### Summary

Status aktivnosti operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-DatumKreiranja'></a>
### DatumKreiranja `property`

##### Summary

Datum kreiranja operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Id'></a>
### Id `property`

##### Summary

Šifra operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Ime'></a>
### Ime `property`

##### Summary

Ime operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Nickname'></a>
### Nickname `property`

##### Summary

Nadimak operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-NicknameLocked'></a>
### NicknameLocked `property`

##### Summary

Označava je li nadimak zaključan

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Prezime'></a>
### Prezime `property`

##### Summary

Prezime operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-Uloge'></a>
### Uloge `property`

##### Summary

Uloge operatera

<a name='P-Backend-Models-DTO-OperaterDetailsDTO-ZadnjaPromjenaLozinke'></a>
### ZadnjaPromjenaLozinke `property`

##### Summary

Datum zadnje promjene lozinke

<a name='T-Backend-Models-OperaterOperaterUloga'></a>
## OperaterOperaterUloga `type`

##### Namespace

Backend.Models

##### Summary

Model veze između operatera i uloge (many-to-many)

<a name='P-Backend-Models-OperaterOperaterUloga-Operater'></a>
### Operater `property`

##### Summary

Referenca na operatera

<a name='P-Backend-Models-OperaterOperaterUloga-OperaterId'></a>
### OperaterId `property`

##### Summary

ID operatera

<a name='P-Backend-Models-OperaterOperaterUloga-OperaterUloga'></a>
### OperaterUloga `property`

##### Summary

Referenca na ulogu operatera

<a name='P-Backend-Models-OperaterOperaterUloga-OperaterUlogaId'></a>
### OperaterUlogaId `property`

##### Summary

ID uloge operatera

<a name='T-Backend-Models-DTO-OperaterReadDTO'></a>
## OperaterReadDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za čitanje podataka o operateru.

<a name='P-Backend-Models-DTO-OperaterReadDTO-Aktivan'></a>
### Aktivan `property`

##### Summary

Status aktivnosti operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-Id'></a>
### Id `property`

##### Summary

Šifra operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-Ime'></a>
### Ime `property`

##### Summary

Ime operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-Nickname'></a>
### Nickname `property`

##### Summary

Nadimak operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-NicknameLocked'></a>
### NicknameLocked `property`

##### Summary

Označava je li nadimak zaključan

<a name='P-Backend-Models-DTO-OperaterReadDTO-Prezime'></a>
### Prezime `property`

##### Summary

Prezime operatera

<a name='P-Backend-Models-DTO-OperaterReadDTO-Uloge'></a>
### Uloge `property`

##### Summary

Uloge operatera

<a name='T-Backend-Models-DTO-OperaterRegisterDTO'></a>
## OperaterRegisterDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za registraciju novog operatera.

<a name='P-Backend-Models-DTO-OperaterRegisterDTO-Ime'></a>
### Ime `property`

##### Summary

Ime operatera

<a name='P-Backend-Models-DTO-OperaterRegisterDTO-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera

<a name='P-Backend-Models-DTO-OperaterRegisterDTO-Lozinka'></a>
### Lozinka `property`

##### Summary

Lozinka operatera

<a name='P-Backend-Models-DTO-OperaterRegisterDTO-Prezime'></a>
### Prezime `property`

##### Summary

Prezime operatera

<a name='T-Backend-Models-OperaterUloga'></a>
## OperaterUloga `type`

##### Namespace

Backend.Models

##### Summary

Model uloge operatera u sustavu

<a name='P-Backend-Models-OperaterUloga-Naziv'></a>
### Naziv `property`

##### Summary

Naziv uloge

<a name='P-Backend-Models-OperaterUloga-OperaterOperaterUloge'></a>
### OperaterOperaterUloge `property`

##### Summary

Veza s operaterima (many-to-many)

<a name='P-Backend-Models-OperaterUloga-Opis'></a>
### Opis `property`

##### Summary

Opis uloge

<a name='T-Backend-Models-DTO-OperaterUlogaDTO'></a>
## OperaterUlogaDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za uloge operatera.

<a name='P-Backend-Models-DTO-OperaterUlogaDTO-Id'></a>
### Id `property`

##### Summary

Šifra uloge

<a name='P-Backend-Models-DTO-OperaterUlogaDTO-Naziv'></a>
### Naziv `property`

##### Summary

Naziv uloge

<a name='P-Backend-Models-DTO-OperaterUlogaDTO-Opis'></a>
### Opis `property`

##### Summary

Opis uloge

<a name='T-Backend-Models-DTO-OperaterUpdateDTO'></a>
## OperaterUpdateDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za ažuriranje podataka o operateru.

<a name='P-Backend-Models-DTO-OperaterUpdateDTO-Ime'></a>
### Ime `property`

##### Summary

Ime operatera

<a name='P-Backend-Models-DTO-OperaterUpdateDTO-KorisnickoIme'></a>
### KorisnickoIme `property`

##### Summary

Korisničko ime operatera

<a name='P-Backend-Models-DTO-OperaterUpdateDTO-Prezime'></a>
### Prezime `property`

##### Summary

Prezime operatera

<a name='T-Backend-Models-DTO-OperaterUpdateRolesDTO'></a>
## OperaterUpdateRolesDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za ažuriranje uloga operatera.

<a name='P-Backend-Models-DTO-OperaterUpdateRolesDTO-OperaterId'></a>
### OperaterId `property`

##### Summary

Šifra operatera

<a name='P-Backend-Models-DTO-OperaterUpdateRolesDTO-Uloge'></a>
### Uloge `property`

##### Summary

Lista uloga koje se dodjeljuju operateru

<a name='T-Backend-Models-DTO-PasswordChangeDTO'></a>
## PasswordChangeDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za promjenu lozinke.

<a name='P-Backend-Models-DTO-PasswordChangeDTO-NovaLozinka'></a>
### NovaLozinka `property`

##### Summary

Nova lozinka operatera

<a name='P-Backend-Models-DTO-PasswordChangeDTO-TrenutnaLozinka'></a>
### TrenutnaLozinka `property`

##### Summary

Trenutna lozinka operatera

<a name='T-Backend-Controllers-PocetnaController'></a>
## PocetnaController `type`

##### Namespace

Backend.Controllers

##### Summary

Kontroler za početne operacije.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _context | [T:Backend.Controllers.PocetnaController](#T-T-Backend-Controllers-PocetnaController 'T:Backend.Controllers.PocetnaController') | Kontekst baze podataka. |

<a name='M-Backend-Controllers-PocetnaController-#ctor-Backend-Data-BackendContext-'></a>
### #ctor(_context) `constructor`

##### Summary

Kontroler za početne operacije.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _context | [Backend.Data.BackendContext](#T-Backend-Data-BackendContext 'Backend.Data.BackendContext') | Kontekst baze podataka. |

<a name='M-Backend-Controllers-PocetnaController-DostupneStavke'></a>
### DostupneStavke() `method`

##### Summary

Dohvaća dostupne stavke.

##### Returns

Lista dostupnih stavki.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-PocetnaController-GrafPodaci'></a>
### GrafPodaci() `method`

##### Summary

Dohvaća podatke za graf - broj kupaca po proizvodu.

##### Returns

Podaci za graf.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-PocetnaController-UkupnoKupaca'></a>
### UkupnoKupaca() `method`

##### Summary

Dohvaća ukupan broj kupaca.

##### Returns

Ukupan broj kupaca.

##### Parameters

This method has no parameters.

<a name='T-Backend-Controllers-ProizvodController'></a>
## ProizvodController `type`

##### Namespace

Backend.Controllers

##### Summary

Kontroler za upravljanje proizvodima.

<a name='M-Backend-Controllers-ProizvodController-#ctor-Backend-Data-BackendContext,AutoMapper-IMapper-'></a>
### #ctor(context,mapper) `constructor`

##### Summary

Konstruktor za ProizvodController.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| context | [Backend.Data.BackendContext](#T-Backend-Data-BackendContext 'Backend.Data.BackendContext') | Kontekst baze podataka. |
| mapper | [AutoMapper.IMapper](#T-AutoMapper-IMapper 'AutoMapper.IMapper') | Mapper za mapiranje između modela i DTO-a. |

<a name='M-Backend-Controllers-ProizvodController-Delete-System-Int32-'></a>
### Delete(sifra) `method`

##### Summary

Briše proizvod.

##### Returns

Status brisanja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra proizvoda. |

<a name='M-Backend-Controllers-ProizvodController-DohvatiPodatkeZaGraf'></a>
### DohvatiPodatkeZaGraf() `method`

##### Summary

Dohvaća podatke za graf - ukupan broj prodanih primjeraka po proizvodu.

##### Returns

Podaci za graf.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-ProizvodController-Get'></a>
### Get() `method`

##### Summary

Dohvaća sve proizvode.

##### Returns

Lista proizvoda.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-ProizvodController-Get-System-Int32-'></a>
### Get(sifra) `method`

##### Summary

Dohvaća proizvod prema šifri.

##### Returns

Proizvod s traženom šifrom.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra proizvoda. |

<a name='M-Backend-Controllers-ProizvodController-Post-Backend-Models-DTO-ProizvodDTOInsertUpdate-'></a>
### Post(proizvodDTO) `method`

##### Summary

Dodaje novi proizvod.

##### Returns

Dodani proizvod.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proizvodDTO | [Backend.Models.DTO.ProizvodDTOInsertUpdate](#T-Backend-Models-DTO-ProizvodDTOInsertUpdate 'Backend.Models.DTO.ProizvodDTOInsertUpdate') | Podaci o proizvodu. |

<a name='M-Backend-Controllers-ProizvodController-PostaviSliku-System-Int32,Backend-Models-DTO-SlikaDTO-'></a>
### PostaviSliku(sifra,slika) `method`

##### Summary

Postavlja sliku za proizvod.

##### Returns

Status postavljanja slike.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra proizvoda. |
| slika | [Backend.Models.DTO.SlikaDTO](#T-Backend-Models-DTO-SlikaDTO 'Backend.Models.DTO.SlikaDTO') | Podaci o slici. |

<a name='M-Backend-Controllers-ProizvodController-Put-System-Int32,Backend-Models-DTO-ProizvodDTOInsertUpdate-'></a>
### Put(sifra,proizvodDTO) `method`

##### Summary

Ažurira postojeći proizvod.

##### Returns

Ažurirani proizvod.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra proizvoda. |
| proizvodDTO | [Backend.Models.DTO.ProizvodDTOInsertUpdate](#T-Backend-Models-DTO-ProizvodDTOInsertUpdate 'Backend.Models.DTO.ProizvodDTOInsertUpdate') | Podaci o proizvodu. |

<a name='T-Backend-Controllers-RacunController'></a>
## RacunController `type`

##### Namespace

Backend.Controllers

<a name='M-Backend-Controllers-RacunController-Delete-System-Int32-'></a>
### Delete(sifra) `method`

##### Summary

Briše račun.

##### Returns

Status brisanja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |

<a name='M-Backend-Controllers-RacunController-DodajStavku-System-Int32,Backend-Models-DTO-StavkaDTOInsert-'></a>
### DodajStavku(sifraRacuna,stavkaDTO) `method`

##### Summary

Dodaje stavku na račun.

##### Returns

Dodana stavka.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifraRacuna | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |
| stavkaDTO | [Backend.Models.DTO.StavkaDTOInsert](#T-Backend-Models-DTO-StavkaDTOInsert 'Backend.Models.DTO.StavkaDTOInsert') | Podaci o stavci. |

<a name='M-Backend-Controllers-RacunController-Get'></a>
### Get() `method`

##### Summary

Dohvaća sve račune.

##### Returns

Lista računa.

##### Parameters

This method has no parameters.

<a name='M-Backend-Controllers-RacunController-Get-System-Int32-'></a>
### Get(sifra) `method`

##### Summary

Dohvaća račun prema šifri.

##### Returns

Račun s traženom šifrom.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |

<a name='M-Backend-Controllers-RacunController-GetStavkeRacuna-System-Int32-'></a>
### GetStavkeRacuna(sifraRacuna) `method`

##### Summary

Dohvaća stavke računa.

##### Returns

Lista stavki računa.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifraRacuna | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |

<a name='M-Backend-Controllers-RacunController-IzmijeniStavku-System-Int32,System-Int32,Backend-Models-DTO-StavkaDTOUpdate-'></a>
### IzmijeniStavku(sifraRacuna,sifraStavke,stavkaDTO) `method`

##### Summary

Ažurira stavku na računu.

##### Returns

Ažurirana stavka.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifraRacuna | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |
| sifraStavke | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra stavke. |
| stavkaDTO | [Backend.Models.DTO.StavkaDTOUpdate](#T-Backend-Models-DTO-StavkaDTOUpdate 'Backend.Models.DTO.StavkaDTOUpdate') | Podaci o stavci. |

<a name='M-Backend-Controllers-RacunController-ObrisiStavku-System-Int32,System-Int32-'></a>
### ObrisiStavku(sifraRacuna,sifraStavke) `method`

##### Summary

Briše stavku s računa.

##### Returns

Status brisanja.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifraRacuna | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |
| sifraStavke | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra stavke. |

<a name='M-Backend-Controllers-RacunController-Post-Backend-Models-DTO-RacunDTOInsertUpdate-'></a>
### Post(racunDTO) `method`

##### Summary

Dodaje novi račun.

##### Returns

Dodani račun.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| racunDTO | [Backend.Models.DTO.RacunDTOInsertUpdate](#T-Backend-Models-DTO-RacunDTOInsertUpdate 'Backend.Models.DTO.RacunDTOInsertUpdate') | Podaci o računu. |

<a name='M-Backend-Controllers-RacunController-Put-System-Int32,Backend-Models-DTO-RacunDTOInsertUpdate-'></a>
### Put(sifra,racunDTO) `method`

##### Summary

Ažurira postojeći račun.

##### Returns

Ažurirani račun.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sifra | [System.Int32](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.Int32 'System.Int32') | Šifra računa. |
| racunDTO | [Backend.Models.DTO.RacunDTOInsertUpdate](#T-Backend-Models-DTO-RacunDTOInsertUpdate 'Backend.Models.DTO.RacunDTOInsertUpdate') | Podaci o računu. |

<a name='T-Backend-Models-DTO-SlikaDTO'></a>
## SlikaDTO `type`

##### Namespace

Backend.Models.DTO

##### Summary

DTO za unos slike.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Base64 | [T:Backend.Models.DTO.SlikaDTO](#T-T-Backend-Models-DTO-SlikaDTO 'T:Backend.Models.DTO.SlikaDTO') | Slika zapisana u Base64 formatu |

<a name='M-Backend-Models-DTO-SlikaDTO-#ctor-System-String-'></a>
### #ctor(Base64) `constructor`

##### Summary

DTO za unos slike.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| Base64 | [System.String](http://msdn.microsoft.com/query/dev14.query?appId=Dev14IDEF1&l=EN-US&k=k:System.String 'System.String') | Slika zapisana u Base64 formatu |

<a name='P-Backend-Models-DTO-SlikaDTO-Base64'></a>
### Base64 `property`

##### Summary

Slika zapisana u Base64 formatu
