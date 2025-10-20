using System.Linq;
using System.Text.Json;
using Microsoft.Extensions.Options;
using WeatherApi.Models;

namespace WeatherApi.Services;

public class WeatherService : IWeatherService
{
    private readonly HttpClient _httpClient;
    private readonly OpenWeatherOptions _options;
    private readonly JsonSerializerOptions _serializerOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true
    };

    public WeatherService(HttpClient httpClient, IOptions<OpenWeatherOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;

        if (!string.IsNullOrWhiteSpace(_options.BaseUrl))
        {
            _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        }
    }

    public async Task<WeatherSummary> GetCurrentWeatherAsync(double latitude, double longitude, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new WeatherServiceException("OpenWeather API key is not configured.");
        }

        var query = $"?lat={latitude}&lon={longitude}&exclude=minutely,hourly,daily,alerts&appid={_options.ApiKey}&units=metric";

        using var request = new HttpRequestMessage(HttpMethod.Get, query);

        using var response = await _httpClient.SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new WeatherServiceException("Unable to retrieve weather data at this time.");
        }

        var contentStream = await response.Content.ReadAsStreamAsync(cancellationToken);

        var weather = await JsonSerializer.DeserializeAsync<OpenWeatherApiResponse>(contentStream, _serializerOptions, cancellationToken);

        if (weather?.Current is null)
        {
            throw new WeatherServiceException("Weather data was not available.");
        }

        var description = weather.Current.Weather?.FirstOrDefault();

        return new WeatherSummary(
            weather.Current.Temperature,
            description?.Description ?? string.Empty,
            description?.Icon ?? string.Empty,
            weather.Current.Humidity,
            weather.Current.WindSpeed,
            weather.Timezone
        );
    }
}
