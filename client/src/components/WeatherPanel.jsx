import PropTypes from 'prop-types';

const WeatherPanel = ({ status, error, weather }) => {
  return (
    <aside className="weather-panel">
      <h1 className="weather-title">Weather details</h1>
      {status === 'loading' && <p className="weather-status">Loading latest data…</p>}
      {status === 'error' && (
        <p className="weather-error">{error || 'Unable to fetch weather data.'}</p>
      )}
      {status === 'idle' && weather && (
        <div className="weather-content">
          <div className="weather-temp">
            {weather.temperature !== null ? `${weather.temperature}°` : 'N/A'}
          </div>
          {weather.icon && (
            <img
              alt={weather.description || 'Weather icon'}
              className="weather-icon"
              src={weather.icon}
            />
          )}
          {weather.description && <p className="weather-description">{weather.description}</p>}
        </div>
      )}
      {status === 'idle' && !weather && (
        <p className="weather-placeholder">Move the marker to load the weather.</p>
      )}
    </aside>
  );
};

WeatherPanel.propTypes = {
  status: PropTypes.oneOf(['idle', 'loading', 'error']).isRequired,
  error: PropTypes.string,
  weather: PropTypes.shape({
    temperature: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
    icon: PropTypes.string
  })
};

WeatherPanel.defaultProps = {
  error: '',
  weather: null
};

export default WeatherPanel;
