import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a payment (store pending payment in the database)
  async createPayment(dto: CreatePaymentDto) {
    // Check property exists
    const property = await this.prisma.property.findUnique({
      where: { id: dto.propertyId },
    });
    if (!property) {
      throw new BadRequestException('Property not found');
    }
    // Prevent owner from paying their own property
    if (property.ownerId === dto.userId) {
      throw new BadRequestException(
        'Owners cannot pay for their own properties',
      );
    }

    // Create payment record with status 'Pending'
    const payment = await this.prisma.payment.create({
      data: {
        userId: dto.userId,
        propertyId: dto.propertyId,
        amount: dto.amount,
        khaltiToken: dto.khaltiToken,
        status: 'Pending', // Initial status
        method: 'KHALTI', // Assuming all payments are via Khalti for now
      },
    });

    return payment;
  }

//   Verify khalti payment
async verifyPayment(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
}
