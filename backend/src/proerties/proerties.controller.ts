import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ProertiesService } from './proerties.service';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import { ownerGuard } from 'src/guard/Owner/owner.guard';
import { PaginationQueryDto } from 'src/pagination/paginationdto';

@Controller('properties')
export class ProertiesController {
  constructor(private readonly proertiesService: ProertiesService) {}

  @UseGuards(ownerGuard)
  @Post()
  create(@Req() req: any, @Body() createProertyDto: CreateProertyDto) {
    return this.proertiesService.create(req.payload?.user.id, createProertyDto);
  }

  // @Get()
  // findAll(@Query() paginationQuery: PaginationQueryDto) {
  //   return this.proertiesService.findAll(paginationQuery);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proertiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProertyDto: UpdateProertyDto) {
    return this.proertiesService.update(+id, updateProertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proertiesService.remove(+id);
  }
}
