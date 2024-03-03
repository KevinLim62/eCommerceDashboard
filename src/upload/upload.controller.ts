import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/upload.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, Roles } from 'src/utils/middlewares';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @Body() body: CreateUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file, body);
  }
}
