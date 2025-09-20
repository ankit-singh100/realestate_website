import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { AdminGuard } from 'src/guard/Admin/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.payload?.user.id);
  }

  @UseGuards(AdminGuard) // Only allow admins
  @Get('admin-dashboard')
  getAdminDashboard(@Req() req: any) {
    // You can fetch additional admin-related data here if needed
    return this.usersService.getProfile(req.payload.user.id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('/avatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(id, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/deleteavatar')
  async deleteAvatar(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserAvatar(+id);
  }
}
