/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './entities/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserUpdateDto } from './entities/user.entity';
const select = {
  id: true,
  name: true,
  email: true,
  birthday: true,
};

@Injectable()
export class UserService {
  constructor(private service: PrismaService) {}

  async create(data: CreateUserDto) {
    return await this.service.user.create({ data });
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

  async findByEmail(email: string) {
    try {
      return await this.service.user.findUnique({ where: { email } });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  async update(id: string, data: Partial<UserUpdateDto>) {
    try {
      return await this.service.user.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.service.user.findUnique({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
