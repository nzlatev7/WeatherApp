# Weather API (Server)

ASP.NET Core 8 Web API that fetches current conditions from OpenWeather and exposes a simplified endpoint for the client.

## Tech Stack

- .NET 8 (`net8.0`)
- ASP.NET Core Web API (controllers)
- Swashbuckle for Swagger UI

## Quick Start

Prerequisites: .NET 8 SDK installed.

```bash
dotnet restore
dotnet build
dotnet run --project WeatherApi
```

Swagger UI: `https://localhost:<port>/swagger`

## Configuration

Configured via `appsettings.json`, environment variables, or User Secrets. Relevant sections:

```json
{
  "Cors": {
    "AllowedOrigin": "http://localhost:5173"
  },
  "OpenWeather": {
    "BaseUrl": "https://api.openweathermap.org/data/3.0/onecall",
    "ApiKey": "<your-api-key>"
  }
}
```

Recommended: keep `ApiKey` out of source control. Use either environment variables or User Secrets:

```bash
# Environment variables (PowerShell):
$env:OpenWeather__ApiKey = "<your-api-key>"

# Or .NET User Secrets (from the WeatherApi folder):
dotnet user-secrets init
dotnet user-secrets set "OpenWeather:ApiKey" "<your-api-key>"
```

You can also change the frontend origin allowed by CORS:

```bash
dotnet user-secrets set "Cors:AllowedOrigin" "http://localhost:5173"
```

## Endpoints

- `GET /weather?lat=<lat>&lon=<lon>`
  - Query: `lat` in [-90, 90], `lon` in [-180, 180]
  - 200 OK → `WeatherSummary`
  - 400 Bad Request → validation error
  - 502 Bad Gateway → upstream/data error

- `GET /health`
  - 200 OK → "OK"

### Response Schema: `WeatherSummary`

```json
{
  "temperature": 12.18,
  "description": "Overcast Clouds",
  "icon": "04d",
  "humidity": 81,
  "windSpeed": 3.6,
  "timezone": "Europe/Sofia"
}
```

Notes:
- `icon` is the OpenWeather icon code (e.g., `04d`). The client converts this into a full icon URL when needed.

## Architecture

- `Controllers/WeatherController.cs` – validates inputs, calls `IWeatherService`, shapes responses and errors.
- `Services/WeatherService.cs` – calls OpenWeather One Call 3.0 with `HttpClient`, maps to `WeatherSummary`.
- `Models/*` – options (`OpenWeatherOptions`), API DTO (`OpenWeatherApiResponse`), and output (`WeatherSummary`).
- `Program.cs` – DI setup, CORS policy, Swagger, HTTPS, controllers.

## Development Notes

- Swagger is enabled in Development.
- CORS policy uses `Cors:AllowedOrigin` if set; otherwise allows all origins.
- HTTPS redirection is enabled; trust the ASP.NET Development Certificate or use HTTP for local testing as needed.

## Testing

Use the included `WeatherApi.http` file (VS/VS Code REST Client) or curl:

```bash
curl "https://localhost:<port>/weather?lat=42.6977&lon=23.3219"
```

## Troubleshooting

- 502 Bad Gateway from `/weather`:
  - Confirm `OpenWeather:ApiKey` is configured and valid.
  - Check network access from the server to OpenWeather.
- CORS errors from the client:
  - Set `Cors:AllowedOrigin` to your dev server origin (e.g., `http://localhost:5173`).
- Cert errors in browser:
  - Trust the ASP.NET Development Certificate or access the HTTP endpoint during development.

