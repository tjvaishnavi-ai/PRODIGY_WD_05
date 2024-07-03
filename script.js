document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    const apiKey = '2bace52a659c9e9cb3510d91762b4301';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-result').innerHTML = '';

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(currentData => {
            if (currentData.cod === 200) {
                fetch(forecastUrl)
                    .then(response => response.json())
                    .then(forecastData => {
                        displayWeatherData(currentData, forecastData);
                        document.getElementById('loading').style.display = 'none';
                    })
                    .catch(error => {
                        document.getElementById('weather-result').innerHTML = `<p>⚠️ Error fetching forecast data.</p>`;
                        console.error('Error fetching forecast data:', error);
                        document.getElementById('loading').style.display = 'none';
                    });
            } else {
                document.getElementById('weather-result').innerHTML = `<p>❌ City not found.</p>`;
                document.getElementById('loading').style.display = 'none';
            }
        })
        .catch(error => {
            document.getElementById('weather-result').innerHTML = `<p>⚠️ Error fetching current weather data.</p>`;
            console.error('Error fetching current weather data:', error);
            document.getElementById('loading').style.display = 'none';
        });
});

function displayWeatherData(currentData, forecastData) {
    const weatherResult = document.getElementById('weather-result');
    const currentWeather = `
        <div class="weather-card">
            <h2>${currentData.name} ${getWeatherEmoji(currentData.weather[0].main)}</h2>
            <p>🌡️ Temperature: ${currentData.main.temp}°C</p>
            <p>🌥️ Weather: ${currentData.weather[0].description}</p>
            <p>💧 Humidity: ${currentData.main.humidity}%</p>
            <p>🌬️ Wind Speed: ${currentData.wind.speed} m/s</p>
        </div>
    `;

    let forecast = '';
    for (let i = 0; i < forecastData.list.length; i += 8) {
        const day = forecastData.list[i];
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        forecast += `
            <div class="forecast-card">
                <h3>${date}</h3>
                <p>${getWeatherEmoji(day.weather[0].main)}</p>
                <p>${day.main.temp}°C</p>
            </div>
        `;
    }

    weatherResult.innerHTML = currentWeather + `<div class="forecast-container">${forecast}</div>`;
}

function getWeatherEmoji(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return '☀️';
        case 'clouds':
            return '☁️';
        case 'rain':
            return '🌧️';
        case 'snow':
            return '❄️';
        case 'thunderstorm':
            return '⛈️';
        case 'drizzle':
            return '🌦️';
        case 'mist':
            return '🌫️';
        default:
            return '';
    }
}
