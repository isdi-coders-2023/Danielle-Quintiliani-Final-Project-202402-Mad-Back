import { Module } from '@nestjs/common';
import { TokenService } from './token/token.service';

@Module({
  providers: [TokenService],
})
export class CoreModule {}
