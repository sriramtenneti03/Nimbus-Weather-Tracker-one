import { Component, ChangeDetectionStrategy, signal, effect, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { WeatherService } from './services/weather.service';
import { CitySearchResult, CombinedWeatherData } from './models/weather.model';
import { TempConverterPipe } from './pipes/temp-converter.pipe';
import { SpeedConverterPipe } from './pipes/speed-converter.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TempConverterPipe, SpeedConverterPipe],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private weatherService = inject(WeatherService);

  // Signals for state management
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedCity = signal<CitySearchResult | null>(null);
  weatherData = signal<CombinedWeatherData | null>(null);
  
  temperatureUnit = signal<'C' | 'F'>('C');
  windSpeedUnit = signal<'m/s' | 'km/h'>('m/s');
  favorites = signal<CitySearchResult[]>([]);
  
  // Autocomplete search
  searchResults = signal<CitySearchResult[]>([]);
  private searchSubject = new Subject<string>();

  isFavorite = computed(() => {
    const city = this.selectedCity();
    if (!city) return false;
    return this.favorites().some(fav => fav.lat === city.lat && fav.lon === city.lon);
  });

  constructor() {
    effect(() => {
      const city = this.selectedCity();
      if (city) {
        this.fetchDataForCity(city);
      }
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.weatherService.findCities(query))
    ).subscribe(results => {
      this.searchResults.set(results);
    });
  }

  ngOnInit(): void {
    this.loadFavorites();
    this.tryGeolocation();
  }
  
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  selectCity(city: CitySearchResult): void {
    this.selectedCity.set(city);
    this.searchResults.set([]);
    const searchInput = document.getElementById('citySearch') as HTMLInputElement;
    if (searchInput) {
        searchInput.value = this.getCityDisplayName(city);
    }
  }

  private fetchDataForCity(city: CitySearchResult): void {
    this.loading.set(true);
    this.error.set(null);
    this.weatherData.set(null);
    this.weatherService.getAllWeatherData(city.lat, city.lon).subscribe({
      next: data => {
        this.weatherData.set(data);
        this.loading.set(false);
      },
      error: err => {
        // More robust error handling to ensure a string is always displayed.
        const errorMessage = err?.message || 'Failed to fetch weather data. Please try again.';
        this.error.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  private tryGeolocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use reverse geocoding to find the city name
          this.weatherService.getCityByCoords(latitude, longitude).subscribe(
            (cities) => {
              if (cities && cities.length > 0) {
                this.selectedCity.set(cities[0]);
              } else {
                // Fallback if no city is found for coords
                const currentLoc: CitySearchResult = {
                  name: 'Current Location',
                  country: '',
                  lat: latitude,
                  lon: longitude
                };
                this.selectedCity.set(currentLoc);
              }
            }
          );
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}`);
          this.loadDefaultCity();
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      this.loadDefaultCity();
    }
  }

  private loadDefaultCity(): void {
    if (this.favorites().length > 0) {
      this.selectedCity.set(this.favorites()[0]);
    } else {
      // Default to a major city if no favorites and no geolocation
      this.selectedCity.set({ name: 'London', lat: 51.5072, lon: -0.1276, country: 'GB' });
    }
  }

  private loadFavorites(): void {
    const favs = localStorage.getItem('weather-app-favorites');
    if (favs) {
      this.favorites.set(JSON.parse(favs));
    }
  }

  toggleFavorite(): void {
    const city = this.selectedCity();
    if (!city) return;
    
    if (this.isFavorite()) {
      this.favorites.update(favs => favs.filter(f => f.lat !== city.lat || f.lon !== city.lon));
    } else {
      this.favorites.update(favs => [...favs, city]);
    }
    localStorage.setItem('weather-app-favorites', JSON.stringify(this.favorites()));
  }

  selectFavorite(city: CitySearchResult): void {
    this.selectedCity.set(city);
  }
  
  removeFavorite(event: MouseEvent, cityToRemove: CitySearchResult): void {
    event.stopPropagation();
    this.favorites.update(favs => favs.filter(f => f.lat !== cityToRemove.lat || f.lon !== cityToRemove.lon));
    localStorage.setItem('weather-app-favorites', JSON.stringify(this.favorites()));
  }

  toggleUnit(): void {
    this.temperatureUnit.update(unit => unit === 'C' ? 'F' : 'C');
  }
  
  toggleWindSpeedUnit(): void {
    this.windSpeedUnit.update(unit => unit === 'm/s' ? 'km/h' : 'm/s');
  }

  getCityDisplayName(city: CitySearchResult | null): string {
    if (!city) return '';
    return `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
  }

  getAirQualityText(aqi: number): { text: string; color: string } {
    switch (aqi) {
      case 1: return { text: 'Good', color: 'text-green-400' };
      case 2: return { text: 'Fair', color: 'text-yellow-400' };
      case 3: return { text: 'Moderate', color: 'text-orange-400' };
      case 4: return { text: 'Poor', color: 'text-red-500' };
      case 5: return { text: 'Very Poor', color: 'text-purple-500' };
      default: return { text: 'Unknown', color: 'text-gray-400' };
    }
  }

  getWeatherBackgroundClass(): string {
    const weather = this.weatherData()?.weather?.weather[0]?.main.toLowerCase();
    if (!weather) return 'from-gray-800 to-gray-900';
    if (weather.includes('clear')) return 'from-blue-400 to-blue-700';
    if (weather.includes('clouds')) return 'from-slate-500 to-slate-700';
    if (weather.includes('rain') || weather.includes('drizzle')) return 'from-indigo-600 to-gray-800';
    if (weather.includes('thunderstorm')) return 'from-gray-700 to-gray-900';
    if (weather.includes('snow')) return 'from-blue-200 to-blue-500';
    return 'from-gray-800 to-gray-900';
  }
}
