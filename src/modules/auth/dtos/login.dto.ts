import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  readonly nickname: string;

  @MinLength(5)
  @IsString()
  readonly password: string;
}
