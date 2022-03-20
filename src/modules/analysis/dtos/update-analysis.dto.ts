import { IsOptional, IsString } from 'class-validator';

export class UpdateAnalysisDto {
  @IsString()
  readonly userId: number;

  // @IsOptional()
  // @IsString()
  // readonly memo: string;
}
