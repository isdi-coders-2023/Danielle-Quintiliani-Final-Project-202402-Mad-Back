/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  SignUser,
  User,
  UserUpdateDto,
} from './entities/user.entity';
import { ImgData } from './entities/avatar.entity';

/* Valutar si calbiar de select! 
const selectCreateDto = {
  name: true,
  id: true,
  email: true,
  role: true,
  birthday: true,
  avatar: {
    select: {
      publicId: true,
      secureUrl: true,
      width: true,
      height: true,
      format: true,
      originalName: true,
    },
  },
}; */

export const select = {
  name: true,
  id: true,
  email: true,
  role: true,
  birthday: true,
  iscriptionAt: true,
  avatar: {
    select: {
      publicId: true,
      secureUrl: true,
      width: true,
      height: true,
      format: true,
      originalName: true,
    },
  },
  item: {
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      owner: true,
      category: true,
      image: {
        select: {
          publicId: true,
          secureUrl: true,
          width: true,
          height: true,
          format: true,
          originalName: true,
        },
      },
    },
  },
  favorite: {
    select: {
      id: true,
      title: true,
      content: true,
      price: true,
      owner: true,
      category: true,
      image: {
        select: {
          publicId: true,
          secureUrl: true,
          width: true,
          height: true,
          format: true,
          originalName: true,
        },
      },
    },
  },
};

@Injectable()
export class UserService {
  constructor(private service: PrismaService) {}

  async create(
    data: CreateUserDto,
    imgData: ImgData | null,
  ): Promise<Partial<User>> {
    return this.service.user.create({
      data: {
        ...data,
        avatar: imgData ? { create: imgData } : {},
      },
      select,
    });
  }

  async findAll() {
    return await this.service.user.findMany({ select });
  }

  async findOne(id: string) /* : Promise<Partial<User>> */ {
    try {
      return await this.service.user.findUnique({ where: { id }, select });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async findForLogin(email: string): Promise<SignUser | null> {
    const result = await this.service.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
      },
    });

    return result;
  }

  async update(
    id: string,
    data: UserUpdateDto,
    imgData: ImgData | null,
  ): Promise<Partial<User>> {
    try {
      return await this.service.user.update({
        where: { id },
        data: {
          ...data,
          avatar: imgData
            ? {
                upsert: {
                  create: imgData,
                  update: imgData,
                },
              }
            : {},
        },
        select,
      });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.service.user.findUnique({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found, can't remove`);
    }
  }
}
