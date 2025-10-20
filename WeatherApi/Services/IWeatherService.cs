using WeatherApi.Models;

namespace WeatherApi.Services;

public interface IWeatherService
{
    Task<WeatherSummary> GetCurrentWeatherAsync(double latitude, double longitude, CancellationToken cancellationToken = default);
}
