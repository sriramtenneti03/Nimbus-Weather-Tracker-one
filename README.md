# 🌦️ Nimbus Weather Tracker Dashboard

A sleek, responsive, and feature-rich weather dashboard built with the latest **Angular** features — including **standalone components**, **signals**, and **zoneless change detection**.  
This application provides **real-time weather data**, **hourly forecasts**, and **air quality information** in a beautifully designed and intuitive interface.

---


---

## ✨ Key Features

- 🎨 **Dynamic & Themed UI:** Background gradients shift elegantly to match live weather conditions (clear, cloudy, rainy, etc.).
- 🌍 **Real-time Weather Data:** Displays current temperature, humidity, wind speed, and pressure for any city.
- ⏰ **Hourly Forecasts:** Shows an 8-hour detailed forecast with temperature and weather icons.
- 🌫️ **Air Quality Index (AQI):** Color-coded AQI system with pollutant details (CO, NO₂, O₃, SO₂).
- 🏙️ **Smart City Search:** Fast, debounced autocomplete search for cities worldwide.
- 📍 **Geolocation Support:** Instantly fetch weather for your current location.
- ⭐ **Persistent Favorites:** Save and revisit your favorite cities, stored locally with `localStorage`.
- 🌡️ **Customizable Units:** Switch between °C/°F and m/s / km/h effortlessly.
- 📱 **Fully Responsive:** Optimized for desktop, tablet, and mobile, styled with **Tailwind CSS**.
- ⚡ **PWA Ready:** Installable and offline-capable via the **Angular Service Worker**.
- 🔄 **Informative Loading & Error States:** Clear feedback during API calls or network issues.

---

## 🛠️ Tech Stack & Architecture

This project showcases **modern Angular development practices** with a focus on performance, scalability, and developer experience.

| Category | Technology / Feature |
|-----------|----------------------|
| **Framework** | Angular (v20+) |
| **Architecture** | Standalone Components (no NgModules) |
| **State Management** | Angular **Signals** for fine-grained reactivity |
| **Change Detection** | **Zoneless** for maximum runtime efficiency |
| **Styling** | Tailwind CSS (utility-first responsive design) |
| **Async Ops** | RxJS (for streams, debounced search, etc.) |
| **PWA** | Angular Service Worker |

---

## 🚀 Getting Started

This project is preconfigured with **mock data**, so no API key is required for testing and development.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git

Navigate to the project directory
cd your-repo-name

3️⃣ Install dependencies and run the dev server

This project supports buildless environments like StackBlitz or AI Studio.
Simply open or run the project locally, and it’s ready to go.

🌐 Connecting to a Live API

To connect to a live data source like OpenWeatherMap, update the WeatherService:

Inject Angular’s HttpClient.

Replace mock methods (findCities, getAllWeatherData, etc.) with real HTTP calls.

Add your API key and manage it securely (e.g., via environment variables).

// Example (src/services/weather.service.ts)
getWeather(city: string): Observable<WeatherData> {
  return this.http.get<WeatherData>(`${API_URL}/weather?q=${city}&appid=${API_KEY}`);
}
