import { Module } from '@nestjs/common';
import { PropertyImageService } from './property-image.service';
import { PropertyImageController } from './property-image.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PropertyImageController],
  providers: [PropertyImageService, PrismaService],
})
export class PropertyImageModule {}
