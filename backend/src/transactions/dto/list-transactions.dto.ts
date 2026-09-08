import { Transform } from 'class-transformer';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class ListTransactionsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.slice(0, 10))
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.slice(0, 10))
  @IsISO8601()
  endDate?: string;
}
