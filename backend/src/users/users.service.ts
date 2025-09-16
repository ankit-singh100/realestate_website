import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  //Creating user
  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailExists(createUserDto.email);
    createUserDto.password = await hash(createUserDto.password, 10);
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  // creating user profile
  async getProfile(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // finding all the user
  findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  // finding individual user according to their unique id
  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  // updating user
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUser(id);
    if (updateUserDto.email) {
      await this.checkIfEmailExists(updateUserDto.email, id);
    }

    if (updateUserDto.password && user.password !== updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // Removing user from db
  async remove(id: number) {
    await this.getUser(id);
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  // checking if the user exist or not
  private async getUser(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    return user;
  }

  // checking if the user email already exist or not
  private async checkIfEmailExists(email: string, id?: number) {
    const emailExist = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExist) {
      if (id && emailExist.id !== id) {
        throw new BadRequestException(`${email} already exists`);
      } else if (!id) {
        throw new BadRequestException(`user with ${email} already exists`);
      }
    }
  }

  // Upload avatar in cloudinary
  async uploadAvatar(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const user = await this.getUser(id);

    // remove old avatar if exists
    if (user.avatarId) {
      await cloudinary.uploader.destroy(user.avatarId, {
        resource_type: 'image',
      });
    }

    // upload new avatar
    const streamUpload = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'avatars', //upload cloudinary folder "avatars"
            transformation: [
              { width: 500, height: 500, crop: 'limit' }, //limit size
              { quality: 'auto' }, //auto compress
            ],
          },
          (error, result) => {
            //callback when upload finishes
            error ? reject(error) : resolve(result);
          },
        );
        // pipe the file buffer into the upload stream
        Readable.from(file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload();

    // Update user record
    return this.prismaService.user.update({
      where: { id },
      data: {
        avatarId: result.public_id,
        avatarUrl: result.secure_url,
      },
    });
  }

  async deleteUserAvatar(id: number) {
    // Fetch only the field we need
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        avatarId: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Ensure user has an avatar
    if (!user.avatarId) {
      throw new BadRequestException('User has no avatar to delete');
    }
    try {
      // Delete from cloudinary
      await cloudinary.uploader
        .destroy(user.avatarId, {
          resource_type: 'image',
        })
        .then((result) => console.log('Deleted:', result))
        .catch((err) => console.error(err));

      // Remove avatar info from database
      const updateUser = await this.prismaService.user.update({
        where: { id },
        data: { avatarId: null, avatarUrl: null },
      });
      return { messagae: 'Avatar deleted successfully', user: updateUser };
    } catch (error) {
      throw new BadRequestException('Failed to delete avatar');
    }
  }
}
