import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';

import { FileService } from '../core/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly filesService: FileService,
  ) {}

  @UseInterceptors(FileInterceptor('data'))
  @Post()
  create(
    @Body() body: { id: string },

    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.uploadImage(body.id, file);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
