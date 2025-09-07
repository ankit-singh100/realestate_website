import { PartialType } from '@nestjs/mapped-types';
import { CreateProertyDto } from './create-proerty.dto';

export class UpdateProertyDto extends PartialType(CreateProertyDto) {}
