import { IsNotEmpty, IsNumber, IsPositive, IsUrl } from 'class-validator';

export class PropertyImageDto {
  @IsUrl()
  url: string;
  publicId: string;
}
