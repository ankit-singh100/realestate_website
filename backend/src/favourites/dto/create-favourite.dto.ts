import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavouriteDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  propertyId: number;
}
