export interface CitySearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherData {
  coord: { lon: number; lat: number; };
  weather: { id: number; main: string; description: string; icon: string; }[];
  base: string;
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number; };
  clouds: { all: number; };
  dt: number;
  sys: { type: number; id: number; country: string; sunrise: number; sunset: number; };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: { temp: number; };
    weather: { icon: string; description: string; }[];
  }[];
}

export interface AirQualityData {
  list: {
    main: { aqi: 1 | 2 | 3 | 4 | 5; };
    components: { co: number; no: number; no2: number; o3: number; so2: number; pm2_5: number; pm10: number; nh3: number; };
  }[];
}

export interface CombinedWeatherData {
  weather: WeatherData;
  forecast: ForecastData;
  airQuality: AirQualityData;
}
