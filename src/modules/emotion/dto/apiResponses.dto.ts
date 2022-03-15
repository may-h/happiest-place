import { ApiProperty } from '@nestjs/swagger';

export class HttpError5xxDto {
  @ApiProperty({
    default: 'Something went wrong😢',
  })
  readonly message: string;
}

export class HttpError4xxDto {
  @ApiProperty({
    description: 'message',
  })
  readonly message: string;
}
