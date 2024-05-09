import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddRatingDto {
  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
}
export class GetVideoDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  sort?: string;
}
