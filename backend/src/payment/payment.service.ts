import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEsewaPaymentDto } from './dto/Create-Payment.dto';

@Injectable()
export class PaymentService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createPaymentDto: CreateEsewaPaymentDto) {
        
    }
}
