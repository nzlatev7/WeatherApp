using Microsoft.AspNetCore.Mvc;
using WeatherApi.Models;
using WeatherApi.Services;

namespace WeatherApi.Controllers;

[ApiController]
[Route("weather")]
public class WeatherController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    public WeatherController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(WeatherSummary), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon, CancellationToken cancellationToken)
    {
        if (lat is < -90 or > 90)
        {
            return BadRequest("Latitude must be between -90 and 90.");
        }

        if (lon is < -180 or > 180)
        {
            return BadRequest("Longitude must be between -180 and 180.");
        }

        try
        {
            var weather = await _weatherService.GetCurrentWeatherAsync(lat, lon, cancellationToken);
            return Ok(weather);
        }
        catch (WeatherServiceException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new { message = ex.Message });
        }
    }
}
