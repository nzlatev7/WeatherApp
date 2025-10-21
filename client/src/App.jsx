import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import WeatherPanel from './components/WeatherPanel.jsx';

// Ensure marker icon assets resolve correctly under Vite
// by deriving URLs relative to this module file.
// This avoids 404s/broken images for the default marker.
// See: https://vitejs.dev/guide/assets.html#importing-asset-as-url
// and Leaflet asset handling notes.
// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

const SOFIA_COORDS = { lat: 42.6977, lng: 23.3219 };
const GEOLOCATION_TIMEOUT = 8000;

function App() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('loading');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const apiBaseUrl = useMemo(() => {
    const base = import.meta.env.VITE_API_BASE_URL?.trim?.();
    return base ? base.replace(/\/$/, '') : '';
  }, []);

  const fetchWeather = useCallback(
    async (coords) => {
      if (!apiBaseUrl) {
        setStatus('error');
        setError('Missing VITE_API_BASE_URL configuration.');
        return;
      }

      setStatus('loading');
      setError('');

      try {
        const response = await fetch(
          `${apiBaseUrl}/weather?lat=${coords.lat}&lon=${coords.lng}`
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        // Normalize icon: API may return an icon code (e.g., "04d").
        // Convert such codes to a full OpenWeather icon URL.
        const rawIcon = payload.icon ?? payload.iconUrl ?? null;
        const icon = (() => {
          if (!rawIcon) return null;
          const str = String(rawIcon);
          // If it's already a URL, keep as-is
          if (/^https?:\/\//i.test(str)) return str;
          // Build OpenWeather icon URL from code
          // Docs: https://openweathermap.org/weather-conditions
          return `https://openweathermap.org/img/wn/${str}@2x.png`;
        })();

        const normalized = {
          temperature: payload.temperature ?? payload.temperatureC ?? null,
          description: payload.description ?? payload.summary ?? 'No description available',
          icon
        };

        setWeather(normalized);
        setStatus('idle');
      } catch (err) {
        console.error(err);
        setStatus('error');
        setError(err.message || 'Failed to retrieve weather data');
      }
    },
    [apiBaseUrl]
  );

  useEffect(() => {
    let isMounted = true;

    const handleSuccess = (position) => {
      if (!isMounted) return;
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setPosition(coords);
    };

    const handleError = () => {
      if (!isMounted) return;
      setPosition(SOFIA_COORDS);
    };

    if (!navigator.geolocation) {
      handleError();
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: GEOLOCATION_TIMEOUT,
      maximumAge: 0
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!position) {
      return;
    }

    fetchWeather(position);
  }, [position, fetchWeather]);

  const handleMarkerDragEnd = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setPosition({ lat, lng });
  };

  const handleMarkerClick = () => {
    if (position) {
      fetchWeather(position);
    }
  };

  return (
    <div className="app">
      <div className="map-container">
        {position && (
          <MapContainer center={position} zoom={11} scrollWheelZoom className="map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={position}
              draggable
              eventHandlers={{
                dragend: handleMarkerDragEnd,
                click: handleMarkerClick
              }}
            >
              <Popup>
                {status === 'loading' && <span>Fetching weather…</span>}
                {status === 'error' && <span>Unable to load weather.</span>}
                {status === 'idle' && weather && (
                  <span>
                    {weather.temperature !== null ? `${weather.temperature}°` : 'No temperature'}
                  </span>
                )}
              </Popup>
            </Marker>
          </MapContainer>
        )}
        {!position && <div className="map-placeholder">Detecting your location…</div>}
      </div>
      <WeatherPanel status={status} error={error} weather={weather} />
    </div>
  );
}

export default App;
