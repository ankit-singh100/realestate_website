import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProertyDto } from './dto/create-proerty.dto';
import { UpdateProertyDto } from './dto/update-proerty.dto';
import axios from 'axios';

import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/pagination/paginationdto';
import { Prisma } from 'generated/prisma';

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
  length: number;
}
@Injectable()
export class ProertiesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(id: number, createProertyDto: CreateProertyDto) {
    const result = await this.prismaService.$queryRawUnsafe<GeocodeResult>(
      `
      INSERT INTO "properties"
      (title, description, price, address, coordinates, latitude, longitude, status, type, "ownerId", "createdAt", "updatedAt")
      VALUES(
      $1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326),
      $5,
      $6,
      $7::"PropertyStatus",
      $8::"PropertyType",
      $9"
      NOW(),
      NOW())
      RETURNING *;`,
      createProertyDto.title,
      createProertyDto.description,
      createProertyDto.price,
      createProertyDto.address,
      createProertyDto.longitude,
      createProertyDto.latitude,
      createProertyDto.status,
      createProertyDto.type,
      id,
    );

    return result[0];
  }

  // async findAll(paginationDto: PaginationQueryDto) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     lat,
  //     lng,
  //     radiuskm,
  //     search,
  //     type,
  //     status,
  //     minPrice,
  //     maxPrice,
  //   } = paginationDto;
  //   if (limit > 100) {
  //     throw new BadRequestException('Limit cannot exceed 100');
  //   }

  //   if (page < 1) {
  //     throw new BadRequestException('Page number must be greater than 0');
  //   }

  //   if (minPrice !== undefined && minPrice < 0) {
  //     throw new BadRequestException('Minimum price cannot be negative');
  //   }

  //   if (maxPrice !== undefined && maxPrice < 0) {
  //     throw new BadRequestException('Maximum price cannot be negative');
  //   }

  //   if (
  //     minPrice !== undefined &&
  //     maxPrice !== undefined &&
  //     minPrice > maxPrice
  //   ) {
  //     throw new BadRequestException(
  //       'Minimum price cannot be greater than maximum price',
  //     );
  //   }

  //   if (isNaN(page) || isNaN(limit)) {
  //     throw new BadRequestException('Page and limit must be valid numbers');
  //   }

  //   const take = limit;
  //   const skip = (page - 1) * take;

  //   // Non-geolocation query
  //   if (lat === undefined || lng === undefined || radiuskm === undefined) {
  //     const where: any = {};

  //     if (search) {
  //       where.OR = [
  //         { title: { contains: search, mode: 'insensitive' } },
  //         { description: { contains: search, mode: 'insensitive' } },
  //       ];
  //     }
  //     if (type) where.type = type;
  //     if (status) where.status = status;
  //     if (minPrice !== undefined || maxPrice !== undefined) {
  //       where.price = {};
  //       if (minPrice !== undefined) where.price.gte = minPrice;
  //       if (maxPrice !== undefined) where.price.lte = maxPrice;
  //     }

  //     const [properties, total] = await Promise.all([
  //       this.prismaService.property.findMany({
  //         skip,
  //         take,
  //         where,
  //         include: {},
  //       }),
  //       this.prismaService.property.count({ where }),
  //     ]);

  //     return {
  //       totalProperties: total,
  //       currentPage: page,
  //       limit: take,
  //       data: properties,
  //     };
  // }

  // Geolocation query with PostGIS
  //   const properties = await this.prismaService.$queryRaw<
  //     Array<any>
  //   >`SELECT p.*,
  //   ST_DistanceSphere(
  //     p.address,
  //     ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)
  //   ) AS distance_m
  //   FROM "properties" p
  //   WHERE ST_DWithin(
  //     p.address::geography,
  //     ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)::geography,
  //     ${radiuskm * 1000}
  //   )
  //   ORDER BY distance_m
  //   LIMIT ${take} OFFSET ${skip};`;

  //   //Count total property within the radius
  //   const [{ count }] = await this.prismaService.$queryRaw<
  //     { count: number }[]
  //   >`SELECT COUNT(*)::int AS count
  //   FROM "properties" p
  //   WHERE ST_DWithin(
  //     p.address::geography,
  //     ST_SetSRID(ST_MakePoint(${Number(lng)}, ${Number(lat)}), 4326)::geography,
  //     ${radiuskm * 1000}
  //   );`;

  //   return {
  //     totalProperties: count,
  //     currentPage: page,
  //     limit: take,
  //     data: properties,
  //   };
  // }

  findOne(id: number) {
    return `This action returns a #${id} proerty`;
  }

  update(id: number, updateProertyDto: UpdateProertyDto) {
    return `This action updates a #${id} proerty`;
  }

  remove(id: number) {
    return `This action removes a #${id} proerty`;
  }

  // helper function to convert address to lat/lng
  private async geocodeAddress(address: string) {
    try {
      const response = await axios.get<GeocodeResult[]>(
        'https://nominatim.openstreetmap.org/search',
        {
          params: { q: address, format: 'json', limit: 1 },
        },
      );
      // if (!response.data.length) {
      //   throw new BadRequestException('Address could not be geocoded');
      // }

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];

        // const latitude = parseFloat(lat);
        // const longitude = parseFloat(lon);

        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
      return null;
    } catch (error) {
      throw new BadRequestException('Error fetching location from address');
    }
  }
}
