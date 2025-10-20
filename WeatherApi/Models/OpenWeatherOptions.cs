namespace WeatherApi.Models;

public class OpenWeatherOptions
{
    public const string SectionName = "OpenWeather";

    public string BaseUrl { get; set; } = "https://api.openweathermap.org/data/3.0/onecall";

    public string ApiKey { get; set; } = string.Empty;
}
