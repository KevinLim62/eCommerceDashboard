require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CreateUploadDto } from './dto/upload.schema';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File, body: CreateUploadDto) {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const dataUri = `data:image/jpeg;base64,${file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'image',
      folder: 'Ecommerce_Dashboard',
    });

    return {
      url: result.url,
    };
  }
}
