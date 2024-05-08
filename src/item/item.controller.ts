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
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './entities/item.entity';
import { OwnerGuard } from '../core/guard/owner.guard';

const Owner = (creatorId: string) => SetMetadata('ownerKey', creatorId);

@Controller('item')
export class ItemController {
  constructor(@Inject('REPO_SERVICE') private itemService: ItemService) {}

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
