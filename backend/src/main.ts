import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //Automatically transform payloads to dto classes
      whitelist: true, //strip unknown properties
      forbidNonWhitelisted: true, //throw error for unknown properties
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    Credentials: true,
  });

  app.useGlobalGuards(new AuthGuard(new JwtService(), new Reflector()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
