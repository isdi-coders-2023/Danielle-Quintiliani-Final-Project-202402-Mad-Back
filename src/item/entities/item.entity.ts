import { User } from '@prisma/client';
import { ImgData } from '../../user/entities/avatar.entity';

export class Item {
  id: string;
  title: string;
  content: string;
  price: string;
  ownwer: User;
  image: ImgData;
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
