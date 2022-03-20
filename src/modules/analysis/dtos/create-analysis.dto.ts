import { IsOptional, IsString } from 'class-validator';

export class CreateAnalysisDto {
  @IsString()
  readonly userId: number;

  @IsOptional()
  @IsString()
  readonly memo: string;
}
