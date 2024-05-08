import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CoreModule } from '../core/core.module';

export type RepoFindId = {
  findMyItem(id: string): Promise<any>;
};

export const REPO_SERVICE = 'REPO_SERVICE';

@Module({
  imports: [PrismaModule, CoreModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    PrismaService,
    {
      provide: 'REPO_SERVICE',
      useClass: ItemService,
    },
  ],
})
export class ItemModule {}
