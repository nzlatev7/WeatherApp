namespace WeatherApi.Services;

public class WeatherServiceException : Exception
{
    public WeatherServiceException(string message) : base(message)
    {
    }
}
