import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'may' })
  @IsString()
  readonly nickname: string;
}
