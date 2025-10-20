import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import WeatherPanel from './components/WeatherPanel.jsx';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
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
        const normalized = {
          temperature: payload.temperature ?? payload.temperatureC ?? null,
          description: payload.description ?? payload.summary ?? 'No description available',
          icon: payload.icon ?? payload.iconUrl ?? null
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
