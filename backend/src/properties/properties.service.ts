import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import axios from 'axios';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/pagination/paginationdto';
import { Prisma, PropertyStatus } from 'generated/prisma';
import { title } from 'process';

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userId: number, createProertyDto: CreateProertyDto) {
    return this.prismaService.property.create({
      data: { ...createProertyDto, ownerId: userId }, // Admin must approve }
    });
  }

  async findByOwner(ownerId: number) {
    const properties = await this.prismaService.property.findMany({
      where: { ownerId },
      include: { images: true },
    });

    if (!properties.length) {
      throw new NotFoundException('No properties found for this owner');
    }

    return properties;
  }

  // async updatePropertyStatus(
  //   id: number,
  //   status: 'onSale' | 'forRental' | 'Sold' | 'Rented',
  // ) {
  //   return this.prismaService.property.update({
  //     where: { id },
  //     data: { status },
  //   });
  // }

  // // Fetch pending properties
  // async getPendingProperties() {
  //   return this.prismaService.property
  //     .findMany({
  //       where: { status: 'Pending' },
  //       include: { owner: { select: { id: true, name: true } } },
  //     })
  //     .then((props) =>
  //       props.map((p) => ({
  //         id: p.id,
  //         title: p.title,
  //         status: p.status,
  //         ownerId: p.ownerId,
  //         ownerName: p.owner.name,
  //       })),
  //     );
  // }

  async findAll(paginationDto: PaginationQueryDto) {
    let {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      minPrice,
      maxPrice,
    } = paginationDto;

    // ensure numbers
    page = Number(page);
    limit = Number(limit);

    if (limit > 100) {
      throw new BadRequestException('Limit cannot exceed 100');
    }

    if (page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }

    if (minPrice !== undefined && minPrice < 0) {
      throw new BadRequestException('Minimum price cannot be negative');
    }

    if (maxPrice !== undefined && maxPrice < 0) {
      throw new BadRequestException('Maximum price cannot be negative');
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new BadRequestException(
        'Minimum price cannot be greater than maximum price',
      );
    }

    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Page and limit must be valid numbers');
    }

    const skip = (page - 1) * limit;

    const where: any = {};

    // Search in title or description
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (status) where.status = status;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Fetch filtered properties & paginated properties in parallel with total count
    const [properties, total] = await Promise.all([
      this.prismaService.property.findMany({
        skip,
        take: limit,
        where,
        include: { images: true },
      }),
      this.prismaService.property.count({ where }),
    ]);

    return {
      totalProperties: total,
      currentPage: page,
      limit,
      data: properties,
    };
  }

  async findOne(id: number) {
    return this.prismaService.property.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
  }

  async update(id: number, updateProertyDto: UpdateProertyDto) {
    return this.prismaService.property.update({
      where: { id },
      data: updateProertyDto,
    });
  }

  async remove(id: number) {
    return this.prismaService.property.delete({
      where: { id },
    });
  }

  private async ensurePropertyExists(id: number) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
    if (property) {
      throw new BadRequestException(`Property already exist`);
    }
    return property;
  }
}
