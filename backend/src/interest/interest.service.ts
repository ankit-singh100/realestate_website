import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InterestService {
  constructor(private prisma: PrismaService) {}

  async addInterest(userId: number, propertyId: number) {
    // checl property status
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new BadRequestException('Property does not exist.');
    }

    if (property.status !== 'onSale' && property.status !== 'forRental') {
      throw new BadRequestException('Property is not available for interest.');
    }

    // Check if user is the owner of the property
    if (property.ownerId === userId) {
      throw new BadRequestException(
        'You cannot express interest in your own property.',
      );
    }
    // Check how many properties user already expressed interest in
    const count = await this.prisma.interest.count({
      where: { userId },
    });

    if (count >= 3) {
      // max 3 properties
      throw new BadRequestException(
        'Maximum interest limit reached (3 properties).',
      );
    }

    // Check if user already expressed interest in this property
    const existing = await this.prisma.interest.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'You have already expressed interest in this property.',
      );
    }

    // Create interest
    return this.prisma.interest.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  async getUserInterests(userId: number) {
    return this.prisma.interest.findMany({
      where: { userId, property: { status: { in: ['onSale', 'forRental'] } } },
      include: {
        property: {
          include: {
            owner: {
              select: { name: true, contact: true, role: true, email: true },
            },
          },
        },
      },
    });
  }

  async getAllInterests() {
    return this.prisma.interest.findMany({
      where: { read: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contact: true,
            avatarUrl: true,
          }, // exclude password
        },
        property: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                contact: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  //   async remove(propertyId: number, userId: number) {
  //     return this.prisma.interest.deleteMany({
  //       where: { propertyId, userId },
  //     });
  //   }

  async markAsRead(propertyId: number, userId: number) {
    return this.prisma.interest.updateMany({
      where: { propertyId, userId },
      data: { read: true },
    });
  }
}
