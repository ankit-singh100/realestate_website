import { Module } from '@nestjs/common';
import { ProertiesService } from './proerties.service';
import { ProertiesController } from './proerties.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProertiesController],
  providers: [ProertiesService, PrismaService],
})
export class ProertiesModule {}
