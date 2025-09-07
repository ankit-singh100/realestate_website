import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
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

  @IsOptional()
  lat?: number;

  @IsOptional()
  lng?: number;

  @IsOptional()
  radiuskm?: number;
}
