import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CitySearchResult, CombinedWeatherData } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {

  findCities(query: string): Observable<CitySearchResult[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }
    const mockCities: CitySearchResult[] = [
      { name: 'Mockville', lat: 40.7128, lon: -74.0060, country: 'US', state: 'NY' },
      { name: 'Faketon', lat: 34.0522, lon: -118.2437, country: 'US', state: 'CA' },
      { name: 'Testburg', lat: 51.5072, lon: -0.1276, country: 'GB', state: 'London' },
      { name: 'Sample City', lat: 48.8566, lon: 2.3522, country: 'FR', state: 'Paris' },
    ];
    
    const results = mockCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    );

    return of(results).pipe(delay(300));
  }
  
  getCityByCoords(lat: number, lon: number): Observable<CitySearchResult[]> {
    const mockCity: CitySearchResult[] = [
      { name: 'Current Location', lat, lon, country: 'GEO', state: 'My State' }
    ];
    return of(mockCity).pipe(delay(300));
  }

  getAllWeatherData(lat: number, lon: number): Observable<CombinedWeatherData> {
    const mockData = this.generateMockWeatherData(lat, lon);
    return of(mockData).pipe(delay(800)); // Simulate network delay
  }

  private generateMockWeatherData(lat: number, lon: number): CombinedWeatherData {
    const now = Date.now() / 1000;
    const weatherOptions = [
        { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' },
        { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
        { id: 211, main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
        { id: 600, main: 'Snow', description: 'light snow', icon: '13d' },
    ];
    const selectedWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    return {
      weather: {
        coord: { lon, lat },
        weather: [selectedWeather],
        base: 'stations',
        main: {
          temp: 18 + Math.random() * 5, // 18-23 C
          feels_like: 17 + Math.random() * 5,
          temp_min: 16,
          temp_max: 25,
          pressure: 1010 + Math.floor(Math.random() * 10),
          humidity: 40 + Math.floor(Math.random() * 30),
        },
        visibility: 10000,
        wind: { speed: 2 + Math.random() * 5, deg: Math.floor(Math.random() * 360) },
        clouds: { all: 5 + Math.floor(Math.random() * 50) },
        dt: now,
        sys: {
          type: 1,
          id: 5122,
          country: 'US',
          sunrise: now - 6 * 3600,
          sunset: now + 6 * 3600,
        },
        timezone: -14400,
        id: 4990729,
        name: 'Mock City',
        cod: 200,
      },
      forecast: {
        list: Array.from({ length: 8 }, (_, i) => ({
          dt: now + (i + 1) * 3 * 3600,
          main: { temp: 18 + Math.random() * 5 - i * 0.5 },
          weather: [weatherOptions[Math.floor(Math.random() * weatherOptions.length)]],
        })),
      },
      airQuality: {
        list: [
          {
            main: { aqi: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5 },
            components: {
              co: 200 + Math.random() * 50,
              no: Math.random() * 2,
              no2: 10 + Math.random() * 15,
              o3: 60 + Math.random() * 40,
              so2: 3 + Math.random() * 5,
              pm2_5: 5 + Math.random() * 10,
              pm10: 8 + Math.random() * 15,
              nh3: Math.random() * 2,
            },
          },
        ],
      },
    };
  }
}
