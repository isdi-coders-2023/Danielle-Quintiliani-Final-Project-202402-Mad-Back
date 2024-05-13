import { Injectable } from '@nestjs/common';
import { ItemImg } from './entities/image.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private service: PrismaService) {}

  async create(data: ItemImg) {
    return await this.service.itemImg.create({ data });
  }

  async remove(id: string) {
    return await this.service.itemImg.delete({ where: { id } });
  }
}
