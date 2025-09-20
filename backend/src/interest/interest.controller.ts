import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { AuthGuard } from 'src/guard/auth/auth.guard'; // your auth guard
import { AdminGuard } from 'src/guard/Admin/admin.guard';

@Controller('interests')
export class InterestController {
  constructor(private interestService: InterestService) {}

  // User must be authenticated
  @UseGuards(AuthGuard)
  @Post(':propertyId')
  async addInterest(@Param('propertyId') propertyId: string, @Req() req: any) {
    const userId = req.payload?.user.id; // assuming AuthGuard attaches user to req
    return this.interestService.addInterest(userId, Number(propertyId));
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserInterests(@Req() req: any) {
    const userId = req.payload?.user.id;
    return this.interestService.getUserInterests(userId);
  }
  @UseGuards(AdminGuard)
  @Get('admin')
  async getAllInterests() {
    // return all interests - admin only
    return this.interestService.getAllInterests();
  }

  //   @UseGuards(AdminGuard)
  //   @Delete(':propertyId/:userId')
  //   async remove(@Param('propertyId') propertyId: string, @Req() req: any) {
  //     return this.interestService.remove(+propertyId, req.payload.user.id);
  //   }

  @UseGuards(AdminGuard)
  @Patch(':propertyId/:userId/read')
  async markInterestAsRead(
    @Param('propertyId') propertyId: string,
    @Param('userId') userId: string,
  ) {
    return this.interestService.markAsRead(Number(propertyId), Number(userId));
  }
}
