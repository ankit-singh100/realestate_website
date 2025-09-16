import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Injectable()
export class FavouritesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFavouriteDto: CreateFavouriteDto) {
    try {
      return this.prismaService.favourite.create({
        data: {
          userId: createFavouriteDto.userId,
          propertyId: createFavouriteDto.propertyId,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findMany() {
    return this.prismaService.favourite.findMany();
  }

  findAll(userId: number) {
    return this.prismaService.favourite.findMany({
      where: { userId },
      include: { property: true },
    });
  }

  async remove(userId: number, propertyId: number) {
    const deleted = await this.prismaService.favourite.deleteMany({
      where: { userId, propertyId },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('Favorite not found');
    }

    return { message: 'Favorite remove successfully' };
  }
}
