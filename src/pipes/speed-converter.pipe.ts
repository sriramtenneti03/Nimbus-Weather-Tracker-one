import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'speedConverter',
  standalone: true
})
export class SpeedConverterPipe implements PipeTransform {
  transform(value: number, unit: 'm/s' | 'km/h'): number {
    if (value === null || value === undefined) {
      return value;
    }
    if (unit === 'm/s') {
      return value;
    }
    // Convert m/s to km/h
    return value * 3.6;
  }
}
