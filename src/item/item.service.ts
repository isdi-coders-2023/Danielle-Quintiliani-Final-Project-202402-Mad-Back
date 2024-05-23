/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, CreateItemDto, UpdateItemDto } from './entities/item.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ImgData } from '../user/entities/avatar.entity';
import { Item } from './entities/item.entity';

export const select = {
  id: true,
  title: true,
  content: true,
  price: true,
  image: true,
  category: true,
  owner: {
    select: {
      id: true,
      name: true,
    },
  },
};

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateItemDto,
    images: ImgData[],
  ) /* : Promise<Partial<Item>> */ {
    return await this.prisma.item.create({
      data: {
        ...data,
        image: images ? { create: images } : {},
      },

      select,
    });
  }

  async findAllItem() {
    return await this.prisma.item.findMany({ select });
  }

  async findMyItem(id: string) {
    try {
      return await this.prisma.item.findUnique({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }
  async findByCategory(category: Category) {
    return await this.prisma.item.findMany({
      where: { category },
      select,
    });
  }

  async updateItem(id: string, updateItemDto: UpdateItemDto) {
    try {
      return await this.prisma.item.update({
        where: { id },
        data: {
          ...updateItemDto,
        },
        select,
      });
    } catch (error) {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }

  async removeItem(id: string) {
    const itemImages = await this.prisma.itemImg.findMany({
      where: { itemId: id },
    });
    const removeImage = itemImages.map(async (image) => {
      return await this.prisma.itemImg.delete({ where: { id: image.id } });
    });

    const item = await this.prisma.item.findUnique({ where: { id } });
    if (item) {
      try {
        return await this.prisma.item.delete({ where: { id } });
      } catch (error) {
        throw new NotFoundException(`Item ${id} not found`);
      }
    }
  }
}
