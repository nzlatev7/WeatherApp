using System.Text.Json.Serialization;

namespace WeatherApi.Models;

public class OpenWeatherApiResponse
{
    [JsonPropertyName("timezone")]
    public string Timezone { get; set; } = string.Empty;

    [JsonPropertyName("current")]
    public CurrentWeather? Current { get; set; }

    public class CurrentWeather
    {
        [JsonPropertyName("temp")]
        public double Temperature { get; set; }

        [JsonPropertyName("humidity")]
        public int Humidity { get; set; }

        [JsonPropertyName("wind_speed")]
        public double WindSpeed { get; set; }

        [JsonPropertyName("weather")]
        public List<WeatherDescription>? Weather { get; set; }
    }

    public class WeatherDescription
    {
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("icon")]
        public string Icon { get; set; } = string.Empty;
    }
}
