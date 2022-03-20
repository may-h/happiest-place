import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class GenerateFilenamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    return value.map((file) => {
      file.filename = this.generateFilename(file.originalname);
      return file;
    });
  }

  generateFilename(filename) {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${filename}`;
  }
}
