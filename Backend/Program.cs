﻿using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Backend.Extensions;


var builder = WebApplication.CreateBuilder(args);

// Dodavanje servisa u kontejner.
builder.Services.AddControllers();
builder.Services.AddBackendSwaggerGen(); // Koristim ekstenziju umjesto AddSwaggerGen
builder.Services.AddBackendCORS();          // Koristim ekstenziju umjesto AddCors
builder.Services.AddDbContext<BackendContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("BackendContext"));
});

// Konfiguracija CORS-a
builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", b =>
    {
        b.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Registracija AutoMapper-a
builder.Services.AddAutoMapper(typeof(Backend.Mapping.BackendProfile));

// SECURITY
builder.Services.AddBackendSecurity();
builder.Services.AddAuthorization();
// END SECURITY

var app = builder.Build();

// Konfiguracija HTTP request pipeline-a.
if (app.Environment.IsDevelopment() || true) // Privremeno uključite za produkciju
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// Swagger
app.UseSwagger();
app.UseSwaggerUI(o =>
{
    o.EnableTryItOutByDefault();
    o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});

// UseCors mora biti pozvan nakon UseRouting i prije UseEndpoints
app.UseRouting();
app.UseCors("CorsPolicy");

// Autentifikacija i autorizacija
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Konfiguracija za frontend
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();
