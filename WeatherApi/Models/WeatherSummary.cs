namespace WeatherApi.Models;

public record WeatherSummary(
    double Temperature,
    string Description,
    string Icon,
    int Humidity,
    double WindSpeed,
    string Timezone
);
