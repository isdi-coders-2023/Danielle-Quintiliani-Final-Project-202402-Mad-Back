import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class FileService {
  async uploadImage(
    owner: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const options = {
      folder: 'nest_2024_1',
      public_id: `${owner}_${file.fieldname}_${file.originalname}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(options, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
