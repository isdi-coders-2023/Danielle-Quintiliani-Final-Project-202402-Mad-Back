import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CoreModule } from '../core/core.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, CoreModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
