import { Logger, Module } from '@nestjs/common';
import { TokenService } from './token/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [TokenService, Logger],
  exports: [TokenService],
})
export class CoreModule {}
