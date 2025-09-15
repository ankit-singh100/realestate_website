import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PropertyStatus, PropertyType } from 'generated/prisma';

export class CreateProertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsString()
  address: string;

  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @IsEnum(PropertyType)
  type: PropertyType;
}
