import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { PropertyImageDto } from './dto/create-property-image.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PropertyImageService {
  constructor(private readonly prismaService: PrismaService) {}
  async upload(file: Express.Multer.File, id: number) {
    const result = await this.uploadToCloud(file, id);
    
    return this.prismaService.propertyImage.create({
      data: {
        propertyId: Number(id),
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  }

  async findAll() {
    return this.prismaService.propertyImage.findMany();
  }

  async deleteImage(id: number) {
    const image = await this.prismaService.propertyImage.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // delete from Cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId, {
        resource_type: 'image',
      });
    }

    // delete from DB
    await this.prismaService.propertyImage.delete({
      where: { id },
    });

    return { message: 'Image deleted successfully' };
  }

  private async uploadToCloud(
    file: Express.Multer.File,
    id: number,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file is provided');
    }

    // validate MINE type
    const allowedMineType = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedMineType.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    // validating the size of the image
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Image size is too large');
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'property-images',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
    
  }
}
