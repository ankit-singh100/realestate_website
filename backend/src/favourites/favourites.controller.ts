import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { use } from 'react';

@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post()
  create(@Body() body: CreateFavouriteDto) {
    return this.favouritesService.create(body);
  }

  @Get()
  findMany() {
    return this.favouritesService.findMany();
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.favouritesService.findAll(Number(userId));
  }

  @Delete()
  remove(
    @Query('userId') userId: string,
    @Query('propertyId') propertyId: string,
  ) {
    return this.favouritesService.remove(Number(userId), Number(propertyId));
  }
}
