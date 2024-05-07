import { Logger, Module } from '@nestjs/common';
import { TokenService } from './token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from './file/file.service';

@Module({
  imports: [JwtModule],
  providers: [TokenService, Logger, FileService],
  exports: [TokenService],
})
export class CoreModule {}
