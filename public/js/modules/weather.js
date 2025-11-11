// ===========================
// Weather Forecast Module
// ===========================

export function initializeWeather() {
    const weatherDaysContainer = document.getElementById('weatherDays');
    if (!weatherDaysContainer) return;

    // Backend API URL - use relative path since nginx proxies /api/ to backend
    const BACKEND_API_URL = '';

    // Fetch weather forecast from backend
    async function fetchWeather() {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/weather`);

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error('Weather data not available');
            }

            // The data is directly the forecast array
            const forecast = result.data;

            if (!Array.isArray(forecast) || forecast.length === 0) {
                throw new Error('Invalid forecast data structure');
            }

            displayWeather(forecast);
        } catch (error) {
            console.error('Weather fetch error:', error);
            weatherDaysContainer.innerHTML = `
                <div class="weather-error">
                    <p>Unable to load weather forecast</p>
                </div>
            `;
        }
    }

    function displayWeather(forecast) {
        if (!forecast || !Array.isArray(forecast)) {
            console.error('Invalid forecast data in displayWeather');
            return;
        }

        weatherDaysContainer.innerHTML = '';

        forecast.forEach((day) => {
            const dayCard = document.createElement('div');
            dayCard.className = 'weather-day';

            // Weather icon mapping
            const iconMap = {
                'Clear': '☀️',
                'Clouds': '☁️',
                'Rain': '🌧️',
                'Drizzle': '🌦️',
                'Thunderstorm': '⛈️',
                'Snow': '❄️',
                'Mist': '🌫️',
                'Smoke': '🌫️',
                'Haze': '🌫️',
                'Dust': '🌫️',
                'Fog': '🌫️',
                'Sand': '🌫️',
                'Ash': '🌫️',
                'Squall': '💨',
                'Tornado': '🌪️'
            };

            const weatherIcon = iconMap[day.main] || '🌤️';

            dayCard.innerHTML = `
                <div class="weather-date">${day.date}</div>
                <div class="weather-icon">${weatherIcon}</div>
                <div class="weather-desc">${day.description}</div>
                <div class="weather-temp">${day.temp_high}° / ${day.temp_low}°</div>
            `;

            weatherDaysContainer.appendChild(dayCard);
        });
    }

    fetchWeather();
}
