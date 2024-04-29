import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './entities/create-user.dto';
import { UserUpdateDto } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UserUpdateDto) {
    return await this.userService.update(id, data);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
