import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as exif from 'exif-parser';

export class extractExifPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    return value.map((file) => {
      const { lat, lng } = this.extractGps(file);
      return { ...file, lat, lng };
    });
  }

  extractGps(file) {
    let { GPSLatitude: lat, GPSLongitude: lng } = exif.create(file.buffer).parse().tags;
    return { lat, lng };
  }
}
