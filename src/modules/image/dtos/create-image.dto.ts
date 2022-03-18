import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  filename: string;
  @IsString()
  orgFilename: string;
  @IsString()
  lat: any;
  @IsString()
  lng: any;
  @IsString()
  url: string;
  @IsOptional()
  @IsString()
  analysisId: number;
  @IsNumber()
  avgHappinessRate: number;
}
