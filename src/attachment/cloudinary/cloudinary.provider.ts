import { v2 as Cloudinary } from 'cloudinary';
import { Provider } from '@nestjs/common';

export const CLOUDINARY = Symbol('CLOUDINARY');

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: () => {
    Cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return Cloudinary;
  },
};
