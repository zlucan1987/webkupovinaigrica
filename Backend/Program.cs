using Backend.Data;
using Backend.Mapping;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// dodati swagger
builder.Services.AddSwaggerGen();

// dodavanje db contexta
builder.Services.AddDbContext<BackendContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("BackendContext"));
});

// Konfiguracija CORS-a
builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", b =>
    {
        b.WithOrigins("https://www.brutallucko.online")
         .AllowAnyMethod()
         .AllowAnyHeader();
    });
});

builder.Services.AddAutoMapper(typeof(BackendProfil));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapOpenApi();

app.UseHttpsRedirection();

app.UseAuthorization();

// swagger sucelje
app.UseSwagger();
app.UseSwaggerUI(o =>
{
    o.EnableTryItOutByDefault();
    o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});

app.MapControllers();
// konfiguracija za frontend
app.UseDefaultFiles(); // Omogućuje posluživanje default datoteka (index.html)
app.UseStaticFiles(); // Omogućuje posluživanje statičkih datoteka

app.MapFallbackToFile("index.html");

// UseCors mora biti pozvan nakon UseRouting i prije UseEndpoints
app.UseCors("CorsPolicy");

app.Run();