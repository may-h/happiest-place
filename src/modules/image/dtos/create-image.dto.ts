import { Analysis } from '../../../entity/Analysis.entity';
import { IsString } from 'class-validator';

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
  @IsString()
  avgHappinessRate: any;
}
