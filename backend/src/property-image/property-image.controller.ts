import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  Delete,
} from '@nestjs/common';
import { PropertyImageService } from './property-image.service';
import { PropertyImageDto } from './dto/create-property-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('property-image')
export class PropertyImageController {
  constructor(private readonly propertyImageService: PropertyImageService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.propertyImageService.upload(file, +id);
  }

  @Get()
  findAll() {
    return this.propertyImageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.propertyImageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePropertyImageDto: UpdatePropertyImageDto,
  // ) {
  //   return this.propertyImageService.update(+id, updatePropertyImageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyImageService.deleteImage(Number(id));
  }
}
