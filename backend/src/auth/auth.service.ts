import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/registerDto';
import { hash, compare } from 'bcrypt';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Checking whether user exist or not
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('user already exist');
    }

    // Hashing password
    registerDto.password = await hash(registerDto.password, 10);

    const user = await this.prismaService.user.create({
      data: registerDto,
    });

    const token = await this.jwtService.signAsync({
      user: {
        id: user.id,
        role: user.role,
      },
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('user not exist');
    }
    if (!(await compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid Credentials');
    }
    const token = await this.jwtService.signAsync({
      user: {
        id: user.id,
        role: user.role,
      },
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
