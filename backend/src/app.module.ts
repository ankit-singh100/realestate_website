import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { PropertiesModule } from './properties/proerties.module';
import { PropertyImageModule } from './property-image/property-image.module';
import { FavouritesModule } from './favourites/favourites.module';
import { InterestService } from './interest/interest.service';
import { InterestModule } from './interest/interest.module';
import { InterestController } from './interest/interest.controller';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    UsersModule,
    PropertiesModule,
    PropertyImageModule,
    FavouritesModule,
    PaymentsModule,
  ],
  controllers: [AuthController, InterestController],
  providers: [AuthService, CloudinaryService, InterestService],
})
export class AppModule {}
