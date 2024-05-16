import { Item } from 'src/item/entities/item.entity';
import { ImgData } from './avatar.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar: Partial<ImgData> | null;
  favorite: Item[];
  item: Item[];
  role: 'USER' | 'ADMIN' | 'CLUB';
}
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar?: Partial<ImgData> | null;
}

export class UserUpdateDto {
  email?: string;
  name?: string;
  password?: string;
  birthday?: string;
  avatar?: Partial<ImgData> | null;
}
export class SignUser {
  id: string;
  email?: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'CLUB';
}
