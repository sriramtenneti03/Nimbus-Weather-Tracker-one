import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempConverter',
  standalone: true
})
export class TempConverterPipe implements PipeTransform {
  transform(value: number, unit: 'C' | 'F'): number {
    if (value === null || value === undefined) {
      return value;
    }
    if (unit === 'C') {
      return value;
    }
    return value * 9 / 5 + 32;
  }
}
