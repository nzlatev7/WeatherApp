<iframe src="https://clueso.site/embed/nv2bl0qpeicc21mv" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="width: 100%; aspect-ratio: 16/9; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" frameborder="0"></iframe>

# Weather Client

A React + Vite map client that shows current weather for a chosen location. Drag the map marker or click it to refresh the weather. Designed to talk to a companion backend via `VITE_API_BASE_URL`.

## Features

- Interactive map with draggable marker (Leaflet via `react-leaflet`).
- Geolocation on load with fallback to Sofia, BG.
- Weather panel showing temperature, condition text, and icon.
- Robust icon handling: accepts full URLs, root‑relative URLs, or OpenWeather icon codes (e.g., `04d`).
- Clean, responsive UI with a side panel.

## Tech Stack

- React 18, Vite
- Leaflet + react-leaflet
- CSS (vanilla)

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A running backend that exposes `/weather?lat=<lat>&lon=<lon>` over HTTP(S)

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file (already present here) and set:

```ini
VITE_API_BASE_URL=https://localhost:7284
```

Notes:
- The value must be the base URL of your backend without a trailing slash.
- If using a self‑signed cert in development, ensure your browser trusts it.

### Run in Development

```bash
npm run dev
```

Vite starts the dev server and opens the app in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
``;

## Project Structure

```
client/
├─ src/
│  ├─ main.jsx           # App entry, global CSS + Leaflet CSS
│  ├─ App.jsx            # Map, geolocation, weather fetching, icon normalization
│  ├─ components/
│  │  └─ WeatherPanel.jsx# Weather UI (temp, description, icon)
│  └─ styles.css         # Styling
├─ .env                  # Vite environment variables
└─ README.md             # This file
```

## How It Works

- On load, the app attempts geolocation; if unavailable or denied, it falls back to Sofia, BG.
- The map centers on the position and displays a draggable marker.
- When the marker stops dragging or is clicked, the app calls the backend:
  - `GET {VITE_API_BASE_URL}/weather?lat=<lat>&lon=<lon>`
- Response is normalized to `{ temperature, description, icon }`.

### Weather Icon Handling

The client accepts multiple shapes from the backend and normalizes to a displayable URL:

- If the backend returns a full URL in `icon` or `iconUrl`, it’s used directly.
- If it returns a root‑relative path (e.g., `/assets/icons/04d.png`), it’s resolved against `VITE_API_BASE_URL`.
- If it returns an OpenWeather icon code (e.g., `04d`), the client constructs:
  - `https://openweathermap.org/img/wn/<code>@2x.png`

## Expected Backend API

Endpoint:

```
GET /weather?lat=<lat>&lon=<lon>
```

Recommended response (any of these fields are supported by the client):

```json
{
  "temperature": 12.18,
  "description": "Overcast Clouds",
  "icon": "04d"              // icon code
  // or
  // "iconUrl": "https://openweathermap.org/img/wn/04d@2x.png" // full URL
  // or
  // "icon": "/static/icons/clouds.png"  // root‑relative URL
}
```

Alternative field names also recognized:

- `temperatureC` instead of `temperature`
- `summary` instead of `description`

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build for production
- `npm run preview` – preview the production build locally

## Troubleshooting

- Icon not showing:
  - Ensure backend returns either a full URL, a root‑relative URL, or a valid OpenWeather icon code (e.g., `01d`, `04n`).
  - If using HTTPS locally, confirm the certificate is trusted.
  - Open the browser dev tools Network tab and verify the icon URL returns 200.
- CORS errors when calling the backend:
  - Configure your backend to allow the dev server origin (typically `http://localhost:5173`).
- Geolocation denied:
  - The app falls back to Sofia; you can still drag the marker anywhere to fetch weather.

## Notes

- Leaflet marker assets are resolved relative to the module to avoid 404s under Vite.
- The app uses minimal CSS for clarity; adapt styles to your needs.

