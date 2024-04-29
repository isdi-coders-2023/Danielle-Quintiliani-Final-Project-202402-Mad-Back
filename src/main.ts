import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const PORT = process.env.PORT || 3400;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
