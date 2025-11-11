# Wedding Website Backend

This is the backend API server for the wedding website. It serves weather forecast data with smart switching between placeholder and live data based on proximity to the bachelorette party dates.

## Overview

The backend provides a weather API endpoint that:
- Uses **placeholder data** by default (from pre-generated JSON files)
- Switches to **live OpenWeatherMap API data** 5 days before the bachelorette party
- Returns to **placeholder data** after the party ends
- Caches weather data for 24 hours to minimize API calls

## Weather Data System

### Two Different APIs

1. **WeatherAPI.com** (https://www.weatherapi.com)
   - Used ONLY for generating placeholder JSON files
   - Free tier available
   - NOT used on the live website
   - Provides both **future forecast** and **historical weather data** for creating realistic placeholder forecasts

2. **OpenWeatherMap** (https://openweathermap.org)
   - Used for LIVE weather updates on the website
   - Requires API key in environment variables
   - Only called when within 5 days of the bachelorette party

### How It Works

```
Timeline:
├─ Default: Placeholder data (from JSON files)
├─ 5 days before party: Switch to live OpenWeatherMap data
├─ During party: Continue using live data
└─ After party ends: Switch back to placeholder data
```

**Current Configuration:**
- **Bachelorette Party Dates:** October 31 - November 2, 2025
- **Live Data Window:** October 26, 2025 - November 2, 2025
- **Location:** Desert Hot Springs, CA (33.9615, -116.5014)

## Generating Placeholder Weather Data

Placeholder JSON files are stored in `/backend/data/` and follow the naming pattern: `YYYY-MM-DD-weather.json`

### Step 1: Get WeatherAPI.com API Key

1. Sign up for free at https://www.weatherapi.com
2. Get your API key from the dashboard

### Step 2: Generate JSON Files

Use the WeatherAPI API Explorer: https://www.weatherapi.com/api-explorer.aspx

**API Endpoints:**

For **future dates** (up to 14 days ahead):
```
GET https://api.weatherapi.com/v1/future.json
```

For **historical dates** (past weather data):
```
GET https://api.weatherapi.com/v1/history.json
```

**Required Parameters:**
- `key`: Your WeatherAPI.com API key
- `q`: Location (e.g., "Desert Hot Springs, CA" or "33.9615,-116.5014")
- `dt`: Date in YYYY-MM-DD format (e.g., "2025-10-31")

**Example Requests:**

For future dates:
```bash
curl "https://api.weatherapi.com/v1/future.json?key=YOUR_API_KEY&q=33.9615,-116.5014&dt=2025-10-31" > data/2025-10-31-weather.json
```

For historical dates:
```bash
curl "https://api.weatherapi.com/v1/history.json?key=YOUR_API_KEY&q=33.9615,-116.5014&dt=2024-10-31" > data/2025-10-31-weather.json
```

**Tip:** You can use historical data from past years as placeholders for future dates. For example, use October 31, 2024 weather data as a placeholder for October 31, 2025.

### Step 3: Required Files

Generate one JSON file for each party date:
- `data/2025-10-31-weather.json` (October 31)
- `data/2025-11-01-weather.json` (November 1)
- `data/2025-11-02-weather.json` (November 2)

### JSON File Structure

The server expects WeatherAPI.com's response format:

```json
{
  "location": {
    "name": "Desert Hot Springs",
    "region": "California",
    "country": "USA",
    "lat": 33.96,
    "lon": -116.50
  },
  "forecast": {
    "forecastday": [
      {
        "date": "2025-10-31",
        "day": {
          "maxtemp_f": 91.2,
          "mintemp_f": 69.4,
          "condition": {
            "text": "Sunny"
          }
        }
      }
    ]
  }
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenWeatherMap API Key (for live weather data)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Server Port (optional, defaults to 3001)
PORT=3001
```

**Note:** The WeatherAPI.com key is NOT needed in production - it's only used for generating placeholder files during development.

## API Endpoints

### GET `/api/weather`

Returns 3-day weather forecast.

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "date": "Oct 31",
      "main": "Clear",
      "description": "sunny",
      "temp_high": 91,
      "temp_low": 69,
      "source": "placeholder"
    }
  ],
  "cached": false,
  "source": "placeholder"
}
```

**Data Source:**
- `"placeholder"` - Data from JSON files
- `"live"` - Data from OpenWeatherMap API

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-10T00:00:00.000Z"
}
```

## Updating Party Dates

To change the bachelorette party dates:

1. Update dates in `server.js`:
```javascript
const PARTY_DATES = ['2025-10-31', '2025-11-01', '2025-11-02'];
const PARTY_START = new Date('2025-10-31T00:00:00-07:00');
const PARTY_END = new Date('2025-11-03T00:00:00-07:00');
```

2. Generate new placeholder JSON files for the new dates (see above)

3. Rename/move old JSON files in `/backend/data/`

4. Clear the weather cache:
```bash
docker-compose exec backend rm -f /app/cache/weather-cache.db
docker-compose restart backend
```

## Updating Location

To change the location (e.g., for a different venue):

1. Update coordinates in `server.js`:
```javascript
const LAT = 33.9615;  // Latitude
const LON = -116.5014; // Longitude
```

2. Generate new placeholder JSON files for the new location

3. Clear cache and restart

## Cache Management

Weather data is cached in SQLite database at `/app/cache/weather-cache.db`

**Cache Settings:**
- **TTL:** 24 hours
- **Clear cache:** `docker-compose exec backend rm -f /app/cache/weather-cache.db`

## Development

### Running Locally

```bash
cd backend
npm install
node server.js
```

### Docker

The backend runs in a Docker container with the main application.

**Rebuild after code changes:**
```bash
docker-compose up -d --build backend
```

**View logs:**
```bash
docker-compose logs -f backend
```

**Access container:**
```bash
docker-compose exec backend sh
```

## Troubleshooting

### Weather showing "undefined" temperatures

**Cause:** Old cached data with wrong format

**Fix:**
```bash
docker-compose exec backend rm -f /app/cache/weather-cache.db
docker-compose restart backend
```

### Wrong dates showing (timezone issues)

**Cause:** Date parsing in UTC instead of local time

**Fix:** Code uses local timezone parsing - ensure `server.js` has:
```javascript
const [year, month, day_num] = date.split('-');
const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day_num));
```

### "Error loading [filename]" in logs

**Cause:** Missing placeholder JSON files

**Fix:** Generate missing files using WeatherAPI.com (see above)

### OpenWeatherMap API errors

**Cause:** Invalid or missing API key

**Fix:**
1. Check `.env` file has `OPENWEATHER_API_KEY`
2. Verify key is valid at https://openweathermap.org
3. Restart backend after updating `.env`

## File Structure

```
backend/
├── server.js           # Main API server
├── package.json        # Dependencies
├── .env               # Environment variables (not in git)
├── cache/             # SQLite cache database
│   └── weather-cache.db
├── data/              # Placeholder weather JSON files
│   ├── 2025-10-31-weather.json
│   ├── 2025-11-01-weather.json
│   └── 2025-11-02-weather.json
└── README.md          # This file
```

## License

Part of TheWeddingParty project.
