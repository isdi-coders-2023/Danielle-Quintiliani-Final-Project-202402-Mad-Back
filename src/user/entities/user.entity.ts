export class User {
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar: string;
  item: [];
  role: 'USER' | 'ADMIN' | 'CLUB';
}
export class UserUpdateDto {
  email?: string;
  name?: string;
  password?: string;
  birthday?: string;
  avatar?: string;
}
