const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('/app/cache/weather-cache.db');

// Create weather cache table
db.exec(`
  CREATE TABLE IF NOT EXISTS weather_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_key TEXT UNIQUE NOT NULL,
    forecast_data TEXT NOT NULL,
    cached_at INTEGER NOT NULL
  )
`);

// API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

if (!OPENWEATHER_API_KEY) {
  console.error('ERROR: OPENWEATHER_API_KEY environment variable is not set!');
  console.error('Please set OPENWEATHER_API_KEY in your .env file or docker-compose.yml');
  process.exit(1);
}

const LAT = 33.9615;
const LON = -116.5014;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Bridal party dates
const PARTY_DATES = ['2025-10-31', '2025-11-01', '2025-11-02'];
const PARTY_START = new Date('2025-10-31T00:00:00-07:00'); // PST timezone
const PARTY_END = new Date('2025-11-03T00:00:00-07:00'); // Day after party ends

// Weather icon mapping for WeatherAPI codes
function getWeatherIcon(conditionText) {
    const text = conditionText.toLowerCase();
    if (text.includes('thunder') || text.includes('storm')) return '⛈️';
    if (text.includes('rain') || text.includes('drizzle')) return '🌧️';
    if (text.includes('snow')) return '❄️';
    if (text.includes('fog') || text.includes('mist')) return '🌫️';
    if (text.includes('sunny') || text.includes('clear')) return '☀️';
    if (text.includes('partly cloudy')) return '⛅';
    if (text.includes('cloudy') || text.includes('overcast')) return '☁️';
    return '☀️';
}

// Check if we should use live weather data
// Use live data between 5 days before party and day after party ends
function shouldUseLiveWeather() {
    const now = new Date();
    const daysUntilParty = Math.floor((PARTY_START - now) / (1000 * 60 * 60 * 24));
    const isBeforePartyEnd = now < PARTY_END;
    const isWithin5Days = daysUntilParty <= 5 && daysUntilParty >= 0;

    console.log(`Days until bridal party: ${daysUntilParty}`);
    console.log(`Before party end: ${isBeforePartyEnd}`);

    return isWithin5Days && isBeforePartyEnd;
}

// Load placeholder weather data from JSON files
function loadPlaceholderData() {
    const forecasts = [];

    for (const date of PARTY_DATES) {
        const fileName = `${date}-weather.json`;
        const filePath = path.join(__dirname, 'data', fileName);

        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const weatherData = JSON.parse(rawData);
            const day = weatherData.forecast.forecastday[0].day;

            // Parse date in local timezone to avoid timezone shift
            const [year, month, day_num] = date.split('-');
            const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day_num));

            forecasts.push({
                date: localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                main: day.condition.text.includes('cloud') ? 'Clouds' :
                      day.condition.text.includes('rain') ? 'Rain' :
                      day.condition.text.includes('sun') || day.condition.text.includes('clear') ? 'Clear' : 'Clear',
                description: day.condition.text.toLowerCase(),
                temp_high: Math.round(day.maxtemp_f),
                temp_low: Math.round(day.mintemp_f)
            });
        } catch (error) {
            console.error(`Error loading ${fileName}:`, error.message);
        }
    }

    return forecasts;
}

// Fetch live weather from OpenWeatherMap (5-day forecast)
async function fetchLiveWeather() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OPENWEATHER_API_KEY}&units=imperial`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenWeatherMap API Error:', errorData);
            throw new Error(`API Error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.list || data.list.length === 0) {
            throw new Error('Weather data not available');
        }

        // Group forecast data by date and calculate daily highs/lows
        const dailyData = {};

        for (const item of data.list) {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString();

            if (!dailyData[dateStr]) {
                dailyData[dateStr] = {
                    date: date,
                    temps: [],
                    weather: item.weather[0]
                };
            }

            dailyData[dateStr].temps.push(item.main.temp);
        }

        // Convert to forecast array with proper format
        const forecasts = [];
        const dateKeys = Object.keys(dailyData).slice(0, 3); // Get first 3 days

        for (const dateStr of dateKeys) {
            const dayData = dailyData[dateStr];
            const temps = dayData.temps;

            forecasts.push({
                date: dayData.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                main: dayData.weather.main,
                description: dayData.weather.description,
                temp_high: Math.round(Math.max(...temps)),
                temp_low: Math.round(Math.min(...temps))
            });
        }

        return forecasts;
    } catch (error) {
        console.error('Error fetching live weather:', error.message);
        throw error;
    }
}

// Weather icon mapping for OpenWeatherMap codes
function getWeatherIconFromCode(weatherCode) {
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️'; // Thunderstorm
    if (weatherCode >= 300 && weatherCode < 400) return '🌦️'; // Drizzle
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️'; // Rain
    if (weatherCode >= 600 && weatherCode < 700) return '❄️'; // Snow
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️'; // Atmosphere
    if (weatherCode === 800) return '☀️'; // Clear
    if (weatherCode === 801) return '🌤️'; // Few clouds
    if (weatherCode === 802) return '⛅'; // Scattered clouds
    if (weatherCode >= 803) return '☁️'; // Clouds
    return '☀️';
}

// Get cached weather data
function getCachedWeather(locationKey) {
    const stmt = db.prepare('SELECT forecast_data, cached_at FROM weather_cache WHERE location_key = ?');
    const row = stmt.get(locationKey);

    if (!row) return null;

    const now = Date.now();
    const cacheAge = now - row.cached_at;

    // Check if cache is still valid (within 24 hours)
    if (cacheAge < CACHE_TTL) {
        console.log(`Cache hit for ${locationKey} (age: ${Math.round(cacheAge / 1000 / 60 / 60)} hours)`);
        return JSON.parse(row.forecast_data);
    }

    console.log(`Cache expired for ${locationKey}`);
    return null;
}

// Save weather data to cache
function setCachedWeather(locationKey, forecastData) {
    const stmt = db.prepare(`
        INSERT INTO weather_cache (location_key, forecast_data, cached_at)
        VALUES (?, ?, ?)
        ON CONFLICT(location_key) DO UPDATE SET
            forecast_data = excluded.forecast_data,
            cached_at = excluded.cached_at
    `);

    stmt.run(locationKey, JSON.stringify(forecastData), Date.now());
    console.log(`Weather data cached for ${locationKey}`);
}

// API endpoint to get weather forecast
app.get('/api/weather', async (req, res) => {
    try {
        const locationKey = 'wedding-weather';

        // Check cache first
        const cachedData = getCachedWeather(locationKey);
        if (cachedData) {
            return res.json({
                success: true,
                data: cachedData,
                cached: true,
                source: cachedData.source || 'unknown'
            });
        }

        let forecasts;
        let source;

        // Determine if we should use placeholder data or live API
        if (shouldUseLiveWeather()) {
            console.log('Within 5 days of bridal party - fetching live weather data...');
            forecasts = await fetchLiveWeather();
            source = 'live';
        } else {
            console.log('Using placeholder weather data (more than 5 days until bridal party)...');
            forecasts = loadPlaceholderData();
            source = 'placeholder';
        }

        // Add source to the data
        const dataWithSource = forecasts.map(f => ({ ...f, source }));

        // Cache the processed data
        setCachedWeather(locationKey, dataWithSource);

        res.json({
            success: true,
            data: dataWithSource,
            cached: false,
            source: source
        });

    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Weather API server running on port ${PORT}`);
    console.log(`Cache TTL: ${CACHE_TTL / 1000 / 60 / 60} hours`);
    console.log(`Bridal party dates: October 31 - November 2, 2025`);
    console.log(`Using ${shouldUseLiveWeather() ? 'LIVE' : 'PLACEHOLDER'} weather data`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    db.close();
    process.exit(0);
});
