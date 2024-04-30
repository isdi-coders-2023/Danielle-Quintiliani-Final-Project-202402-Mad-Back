import { ImgData } from './avatar.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar: Partial<ImgData> | null;
  item: [];
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
