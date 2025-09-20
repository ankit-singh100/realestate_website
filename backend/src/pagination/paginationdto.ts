import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PropertyStatus, PropertyType } from 'generated/prisma';

export class PaginationQueryDto {
  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  // @IsEnum(PropertyType)
  @IsString()
  type?: string;

  @IsOptional()
  // @IsEnum(PropertyStatus)
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
