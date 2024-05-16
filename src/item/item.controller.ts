/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { Category, CreateItemDto, UpdateItemDto } from './entities/item.entity';
import { OwnerGuard } from '../core/guard/owner.guard';
import { ImgData } from '../user/entities/avatar.entity';
import { FileService } from '../core/file/file.service';
import { FilesInterceptor } from '@nestjs/platform-express';

const Owner = (creatorId: string) => SetMetadata('ownerKey', creatorId);

@Controller('item')
export class ItemController {
  constructor(
    @Inject('REPO_SERVICE') private itemService: ItemService,
    private readonly filesService: FileService,
  ) {}

  images = async (
    file: Express.Multer.File,
    owner: string,
  ): Promise<ImgData> => {
    const cloudinaryResponse = await this.filesService.uploadImage(owner, file);
    return {
      publicId: cloudinaryResponse.public_id,
      folder: cloudinaryResponse.folder,
      fieldName: file.fieldname,
      originalName: file.originalname,
      secureUrl: cloudinaryResponse.secure_url,
      resourceType: cloudinaryResponse.resource_type,
      mimetype: file.mimetype,
      format: cloudinaryResponse.format,
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
      bytes: cloudinaryResponse.bytes,
    };
  };

  @UseInterceptors(FilesInterceptor('image'))
  @Post('/add')
  async create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    let images: ImgData[];
    if (files) {
      images = await Promise.all(
        files.map(
          async (image) => await this.images(image, createItemDto.ownerItemId),
        ),
      );
    }
    return this.itemService.create(createItemDto, images);
  }

  @Get()
  async findAll() {
    return await this.itemService.findAllItem();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findMyItem(id);
  }

  @Get()
  async getCategory(@Param('category') category: Category) {
    return await this.itemService.findByCategory(category);
  }

  @Owner('owner')
  @UseGuards(OwnerGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return await this.itemService.updateItem(id, updateItemDto);
  }
  @Owner('owner')
  @UseGuards(OwnerGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.itemService.removeItem(id);
  }
}
