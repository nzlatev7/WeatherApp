<iframe src="https://clueso.site/embed/nv2bl0qpeicc21mv" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="width: 100%; aspect-ratio: 16/9; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" frameborder="0"></iframe>

[Open Demo in Full Page](demo/index.html)

# WeatherApp Monorepo

Full‑stack weather viewer consisting of a React client and an ASP.NET Core backend that wraps OpenWeather’s One Call API.

## Repository Structure

```
WeatherApi/            # ASP.NET Core 8 Web API (server)
client/                # React + Vite application (frontend)
```

- Client README: client/README.md
- Server README: WeatherApi/README.md

## Demo

Watch the embedded video above for a walkthrough.

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn) – for the client
- .NET 8 SDK – for the backend

## Quick Start

1) Configure backend (OpenWeather API key and CORS)

- Edit `WeatherApi/appsettings.json` or use User Secrets/environment variables:

```bash
cd WeatherApi
dotnet user-secrets init
dotnet user-secrets set "OpenWeather:ApiKey" "<your-api-key>"
dotnet user-secrets set "Cors:AllowedOrigin" "http://localhost:5173"
```

2) Configure client API base URL

- In `client/.env` set the backend base URL (no trailing slash):

```ini
VITE_API_BASE_URL=https://localhost:7284
```

3) Run both apps (two terminals)

Terminal A (server):

```bash
dotnet run --project WeatherApi
```

Terminal B (client):

```bash
cd client
npm install
npm run dev
```

Open the client URL printed by Vite (typically `http://localhost:5173`). Swagger is available at `https://localhost:<port>/swagger` on the server.

## What’s Inside

### Backend (WeatherApi)

- `GET /weather?lat=<lat>&lon=<lon>` returns a simplified `WeatherSummary` with:
  - `temperature` (Celsius), `description`, `icon` (OpenWeather icon code), `humidity`, `windSpeed`, `timezone`.
- `GET /health` returns `OK`.
- CORS policy allows the origin configured in `Cors:AllowedOrigin` (or any origin if not set).
- Uses `OpenWeather:BaseUrl` and `OpenWeather:ApiKey` to call OpenWeather One Call 3.0.

### Frontend (client)

- React + Vite + Leaflet map with a draggable marker.
- Attempts browser geolocation; falls back to Sofia, BG.
- Fetches from `${VITE_API_BASE_URL}/weather?lat=<lat>&lon=<lon>` when the marker moves or is clicked.
- Displays temperature, condition text, and an icon. Icon handling accepts:
  - Full URLs, root‑relative URLs (resolved against the API base), or OpenWeather icon codes (e.g., `04d`).

## Development Notes

- HTTPS: The backend uses HTTPS by default. Trust the ASP.NET Dev Certificate or point `VITE_API_BASE_URL` at the HTTP endpoint for local testing.
- CORS: Ensure `Cors:AllowedOrigin` matches the client’s dev origin (usually `http://localhost:5173`).
- Environment files: `client/.env` should not include a trailing slash in `VITE_API_BASE_URL`.

## Troubleshooting

- Weather icon not showing:
  - Verify server returns `icon` (code like `04d`) or a resolvable URL.
  - Check the browser Network tab for the icon request; ensure 200 OK.
- 502 from `/weather`:
  - Confirm a valid OpenWeather API key is configured.
  - Check outbound connectivity to OpenWeather.
- CORS errors:
  - Align `Cors:AllowedOrigin` with the Vite dev origin.
- Geolocation denied:
  - App falls back to Sofia; drag the marker anywhere to fetch weather.

## Scripts Reference

- Client: `npm run dev`, `npm run build`, `npm run preview` (inside `client/`).
- Server: `dotnet build`, `dotnet run --project WeatherApi`.

## License

Project files are provided as‑is; add your preferred license if needed.
