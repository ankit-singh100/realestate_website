import { Module } from '@nestjs/common';
import { InterestController } from './interest.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [InterestController],
  controllers: [InterestController, PrismaService],
})
export class InterestModule {}
