import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  lat: any;

  @IsOptional()
  @IsString()
  lng: any;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  avgHappinessRate: any;
}
