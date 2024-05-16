import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ForbiddenException,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto, CreateUserDto } from './entities/user.entity';
import { LoggedGuard } from '../core/guard/logged.guard';
import { TokenService } from '../core/token/token.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../core/file/file.service';
import { ImgData } from './entities/avatar.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly filesService: FileService,
  ) {}

  avatar = async (
    file: Express.Multer.File,
    email: string,
  ): Promise<ImgData> => {
    const cloudinaryResponse = await this.filesService.uploadImage(email, file);
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

  @UseInterceptors(FileInterceptor('avatar'))
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }),
          new FileTypeValidator({ fileType: 'image/' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { email } = createUserDto;
    let avatar: ImgData | null = null;
    if (file) {
      avatar = await this.avatar(file, email);
    }

    createUserDto.password = await this.tokenService.hash(
      createUserDto.password,
    );
    return this.userService.create(createUserDto, avatar);
  }

  @UseGuards(LoggedGuard)
  @Get('/login')
  async loginWithToken(@Body() validData: { payload: { id: string } }) {
    const userId = validData.payload.id;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new ForbiddenException('Email or password invalid');
    }

    return { token: await this.tokenService.createToken(user) };
  }

  @Post('/login')
  async login(@Body() data: CreateUserDto) {
    const { email, password } = data;
    if (!email || !password) {
      throw new BadRequestException('Email or password are required');
    }

    const user = await this.userService.findForLogin(email);

    if (!user) {
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
  async update(
    @Param('/:id') id: string,
    @Body() updateUserDto: UserUpdateDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100_000 }),
          new FileTypeValidator({ fileType: 'image/' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const email =
      updateUserDto.email || (await this.userService.findOne(id)).email;
    let avatar: ImgData | null = null;
    if (file) {
      avatar = await this.avatar(file, email);
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.tokenService.hash(
        updateUserDto.password,
      );
    }
    return this.userService.update(id, updateUserDto, avatar);
  }

  @Post(':userId/favorite/:itemId')
  async addToFavorites(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    await this.userService.addToFavorites(userId, itemId);
    return { message: 'Item added to favorites successfully' };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
