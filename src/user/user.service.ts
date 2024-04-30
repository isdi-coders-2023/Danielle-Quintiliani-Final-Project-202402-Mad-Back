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

const select = {
  id: true,
  email: true,
  role: true,
  avatar: {
    select: {
      publicId: true,
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

  async findOne(id: string) {
    try {
      return await this.service.user.findUnique({ where: { id } });
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
