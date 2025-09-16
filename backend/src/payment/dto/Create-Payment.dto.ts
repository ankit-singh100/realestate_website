import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { paymentMethod, paymentStatus } from 'generated/prisma';

export class CreateEsewaPaymentDto {
  @IsString()
  amount: string;

  @IsString()
  currency: string;

  @IsEnum(paymentMethod)
  method: paymentMethod;

  @IsEnum(paymentStatus)
  status: paymentStatus;

  @IsString()
  @IsOptional()
  transactionid?: string;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  propertyId: number;
}
