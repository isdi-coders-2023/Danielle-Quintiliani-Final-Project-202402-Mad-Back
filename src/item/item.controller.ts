import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './entities/item.entity';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto);
  }

  @Get()
  async findAll() {
    return await this.itemService.findAllItem();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findMyItem(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return await this.itemService.updateItem(id, updateItemDto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.itemService.removeItem(id);
  }
}
