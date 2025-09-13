import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import axios from 'axios';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/pagination/paginationdto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(id: number, createProertyDto: CreateProertyDto) {
    await this.ensurePropertyExists(id);
    return this.prismaService.property.create({
      data: createProertyDto,
      include: {
        images: true,
      },
    });
  }

  async findAll(paginationDto: PaginationQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      minPrice,
      maxPrice,
    } = paginationDto;
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

    const take = limit;
    const skip = (page - 1) * take;

    const where: any = {};

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

    const [properties, total] = await Promise.all([
      this.prismaService.property.findMany({
        skip,
        take,
        where,
        include: { images: true },
      }),
      this.prismaService.property.count({ where }),
    ]);

    return {
      totalProperties: total,
      currentPage: page,
      limit: take,
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
    await this.ensurePropertyExists(id);
    return this.prismaService.property.update({
      where: { id },
      data: updateProertyDto,
    });
  }

  async remove(id: number) {
    await this.ensurePropertyExists(id);
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
