import { User } from '../../user/entities/user.entity';
import { ImgData } from '../../user/entities/avatar.entity';

export type Category = 'CLOTHES' | 'MOTO' | 'SPAREPARTS' | 'OTHER';

export class Item {
  id: string;
  title: string;
  content: string;
  price: string;
  category: Category;
  owner: Partial<User>;
  image: Partial<ImgData>[];
}

export class CreateItemDto {
  title: string;
  content: string;
  price: string;
  ownerItemId: string;
  category: Category;
  image: Partial<ImgData>[];
}

export class UpdateItemDto {
  title?: string;
  content?: string;
  price?: string;
  category?: Category;
}
