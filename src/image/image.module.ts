import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../core/file/file.service';

@Module({
  imports: [PrismaModule],
  controllers: [ImageController],
  providers: [ImageService, PrismaService, FileService],
})
export class ImageModule {}
