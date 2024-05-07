import { User } from '@prisma/client';

export class Item {
  id: string;
  title: string;
  content: string;
  price: string;
  ownwer: User;
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
