import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CoreModule } from '../core/core.module';

@Module({
  controllers: [UserController, CoreModule],
  providers: [UserService, PrismaService],
})
export class UserModule {}
