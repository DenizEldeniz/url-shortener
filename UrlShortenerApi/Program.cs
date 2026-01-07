var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<UrlShortenerApi.Services.UrlService>(sp => 
    new UrlShortenerApi.Services.UrlService(sp.GetRequiredService<IConfiguration>()));

// CORS Politikası (React uygulaması için gerekli)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .AllowAnyOrigin() // Prod ortamında spesifik origin verilmeli
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowReactApp");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
