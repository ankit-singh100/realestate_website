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
import { PropertiesService } from './properties.service';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import { ownerGuard } from 'src/guard/Owner/owner.guard';
import { PaginationQueryDto } from 'src/pagination/paginationdto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Public } from 'src/helper/public';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(ownerGuard)
  @Post()
  create(@Req() req: any, @Body() createProertyDto: CreateProertyDto) {
    const user = req.payload?.user;
    console.log(user);
    return this.propertiesService.create(user.id, createProertyDto);
  }

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.propertiesService.findAll(paginationQuery);
  }

  @UseGuards(AuthGuard)
  @Get('/get/:id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @UseGuards(ownerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProertyDto: UpdateProertyDto) {
    return this.propertiesService.update(+id, updateProertyDto);
  }

  @UseGuards(ownerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}
