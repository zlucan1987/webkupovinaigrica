using Backend.Data;
using Backend.Mapping;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Dodavanje servisa u kontejner.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<BackendContext>(o =>
{
    o.UseSqlServer(builder.Configuration.GetConnectionString("BackendContext"));
});

// Konfiguracija CORS-a (ograničeno na tvoju domenu)
builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", b =>
    {
        b.WithOrigins("https://www.brutallucko.online") // Promijeni na svoju domenu
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .WithHeaders("Content-Type", "Authorization");
    });
});

// Registracija AutoMapper-a
builder.Services.AddAutoMapper(typeof(Backend.Mapping.BackendProfile));

var app = builder.Build();

// Konfiguracija HTTP request pipeline-a.
app.MapOpenApi();
app.UseHttpsRedirection(); 
app.UseAuthorization();

// Swagger (javan, ali razmotri autentifikaciju)
app.UseSwagger();
app.UseSwaggerUI(o =>
{
    o.EnableTryItOutByDefault();
    o.ConfigObject.AdditionalItems.Add("requestSnippetsEnabled", true);
});

// UseCors mora biti pozvan nakon UseRouting i prije UseEndpoints
app.UseRouting();
app.UseCors("CorsPolicy");
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

// Konfiguracija za frontend
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

app.Run();