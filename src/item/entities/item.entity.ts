import { User } from '@prisma/client';
import { ImgData } from '../../user/entities/avatar.entity';

export class Item {
  id: string;
  title: string;
  content: string;
  price: string;
  owner: Partial<User>;
  image: Partial<ImgData>[];
}

export class CreateItemDto {
  title: string;
  content: string;
  price: string;
  ownerItemId: string;
}

export class UpdateItemDto {
  title?: string;
  content?: string;
  price?: string;
}
