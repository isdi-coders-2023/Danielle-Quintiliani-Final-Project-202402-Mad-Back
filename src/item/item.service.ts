/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto, UpdateItemDto } from './entities/item.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ImgData } from '../user/entities/avatar.entity';

const select = {
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
    try {
      return await this.prisma.item.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Item ${id} not found`);
    }
  }
}
