import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CoreModule } from '../core/core.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileService } from '../core/file/file.service';

@Module({
  imports: [PrismaModule, CoreModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FileService],
})
export class UserModule {}
