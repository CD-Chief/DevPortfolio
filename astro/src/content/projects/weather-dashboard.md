---
id: 3
title: "Weather Dashboard"
size: "S"
tech: ["JavaScript", "API Integration", "Chart.js"]
summary: "Simple weather dashboard that displays current conditions and forecasts for multiple cities."
link: "#"
showMoreButton: true
---

# Weather Dashboard

A clean and intuitive weather dashboard that provides real-time weather information and forecasts for any location worldwide.

![Weather Dashboard Screenshot](/src/assets/projects/image.png)

## Project Overview

This lightweight weather application was built as a learning project to practice API integration and data visualization. Despite its simplicity, it includes several polished features that make it genuinely useful.

## Features

- **Current Weather**: Real-time temperature, conditions, humidity, and wind speed
- **5-Day Forecast**: Extended forecast with daily highs and lows
- **Multiple Locations**: Save and switch between favorite cities
- **Visual Charts**: Temperature trends displayed with Chart.js
- **Responsive Design**: Works on mobile, tablet, and desktop

## API Integration

Uses the OpenWeatherMap API for weather data:

```javascript
async function fetchWeather(city) {
  const apiKey = import.meta.env.WEATHER_API_KEY;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  );
  return response.json();
}
```

## Data Visualization

Implemented Chart.js for temperature trends:

```javascript
new Chart(ctx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: 'Temperature (°C)',
      data: temperatures,
      borderColor: '#5caac3',
      tension: 0.4
    }]
  }
});
```

## Local Storage

User preferences and favorite cities are stored locally:

```javascript
// Save favorite cities
localStorage.setItem('favoriteCities', JSON.stringify(cities));

// Retrieve on page load
const saved = JSON.parse(localStorage.getItem('favoriteCities')) || [];
```

## UI/UX Considerations

- **Loading States**: Skeleton screens while fetching data
- **Error Handling**: Clear error messages for invalid cities or API failures
- **Icons**: Weather condition icons from Open Weather's icon set
- **Search Autocomplete**: City name suggestions as you type

## Challenges

### API Rate Limits
Free tier allows 60 calls/minute. Implemented:
- Debounced search to reduce unnecessary calls
- Cached responses for 10 minutes
- Clear feedback when rate limit is reached

### Time Zone Handling
Weather data comes in UTC, but users want local time:

```javascript
const localTime = new Date(timestamp * 1000)
  .toLocaleString('en-US', { timeZone: cityTimezone });
```

## Learning Outcomes

This project taught me:
- Working with external APIs and handling responses
- Implementing data caching strategies
- Creating responsive layouts with CSS Grid
- Using Chart.js for data visualization
- Managing application state without a framework

## Possible Improvements

- [ ] Add weather alerts and warnings
- [ ] Hourly forecast in addition to daily
- [ ] Weather radar map integration
- [ ] Unit toggle (Celsius/Fahrenheit)
- [ ] PWA capabilities for offline access
- [ ] Historical weather data comparison

## Demo

Try searching for your city to see current weather and forecast!
