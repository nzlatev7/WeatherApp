using WeatherApi.Models;
using WeatherApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<OpenWeatherOptions>(builder.Configuration.GetSection(OpenWeatherOptions.SectionName));

builder.Services.AddHttpClient<IWeatherService, WeatherService>();

const string AllowFrontendOrigin = "AllowFrontendOrigin";
var allowedOrigin = builder.Configuration.GetValue<string>("Cors:AllowedOrigin");

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowFrontendOrigin, policy =>
    {
        if (!string.IsNullOrWhiteSpace(allowedOrigin))
        {
            policy.WithOrigins(allowedOrigin)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(AllowFrontendOrigin);

app.UseAuthorization();

app.MapControllers();

app.Run();
