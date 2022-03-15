import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 1 })
  readonly id: string;

  @ApiProperty({ example: 'may' })
  readonly nickname: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
