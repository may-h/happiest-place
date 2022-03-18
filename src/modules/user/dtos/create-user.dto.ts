import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'may' })
  @IsString()
  readonly nickname: string;
}
