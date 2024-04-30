import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './entities/create-user.dto';
import { UserUpdateDto } from './entities/user.entity';
import { LoggedGuard } from '../core/guard/logged.guard';
import { TokenService } from '../core/token/token.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/register')
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @UseGuards(LoggedGuard)
  @Get('login')
  async loginWithToken(@Body() validData: { payload: { id: string } }) {
    const userId = validData.payload.id;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('Email or password invalid');
    }

    return { token: await this.tokenService.createToken(user) };
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    if (!email || !password) {
      throw new BadRequestException('Email or password are required');
    }

    const user = await this.userService.findForLogin(email);

    if (!user) {
      throw new ForbiddenException('Email or password invalid');
    }

    if (!(await this.tokenService.compare(password, user.password!))) {
      throw new ForbiddenException('Email or password invalid');
    }

    return { token: await this.tokenService.createToken(user) };
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
