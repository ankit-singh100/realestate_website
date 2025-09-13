import { PartialType } from '@nestjs/mapped-types';
import { PropertyImageDto } from './create-property-image.dto';

export class UpdatePropertyImageDto extends PartialType(PropertyImageDto) {}
