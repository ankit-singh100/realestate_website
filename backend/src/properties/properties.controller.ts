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
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import { ownerGuard } from 'src/guard/Owner/owner.guard';
import { PaginationQueryDto } from 'src/pagination/paginationdto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { Public } from 'src/helper/public';
import { AdminGuard } from 'src/guard/Admin/admin.guard';
import { PropertyStatus } from 'generated/prisma';
import { CreateInterestDto } from './dto/create-interest.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(ownerGuard)
  @Post()
  create(@Req() req: any, @Body() createProertyDto: CreateProertyDto) {
    const user = req.payload?.user;
    return this.propertiesService.create(user.id, createProertyDto);
  }

  // @Patch(':id/approve')
  // @UseGuards(AdminGuard) // Only admins can access
  // async approveProperty(
  //   @Param('id') id: string,
  //   @Body() body: { status: 'onSale' | 'forRental' | 'Sold' | 'Rented' },
  // ) {
  //   if (!body.status) {
  //     throw new BadRequestException('Status is required');
  //   }

  //   return this.propertiesService.updatePropertyStatus(+id, body.status);
  // }

  // admin gets all interested requests

  // Get properties by owner ID
  @UseGuards(ownerGuard)
  @Get('owner/:ownerId')
  async getByOwner(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.propertiesService.findByOwner(ownerId);
  }

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.propertiesService.findAll(paginationQuery);
  }

  @UseGuards(AuthGuard)
  @Get('get/:id')
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
