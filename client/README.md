# Weather API React Client

A minimal React + Leaflet interface that visualises weather information returned by the Weather API backend.

## Features

- Detects the user's location via the browser and falls back to Sofia, Bulgaria if geolocation is not available or denied.
- Displays an interactive OpenStreetMap (Leaflet) map with a draggable marker.
- Fetches weather information (temperature, description, icon) from the configured API when the marker is dragged or clicked.
- Provides simple loading and error states alongside a dedicated weather details panel.

## Getting started

```bash
cd client
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and set `VITE_API_BASE_URL` to your backend URL (without a trailing slash).

The client expects an endpoint accessible via `GET {VITE_API_BASE_URL}/weather?lat=<latitude>&lon=<longitude>` returning a JSON payload containing at least `temperature`, `description`, and optionally `icon` (URL to an icon image).
