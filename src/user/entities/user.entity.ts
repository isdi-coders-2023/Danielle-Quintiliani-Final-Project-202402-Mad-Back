export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar: string;
  item: [];
  role: 'USER' | 'ADMIN' | 'CLUB';
}
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthday: string;
  avatar?: string;
}

export class UserUpdateDto {
  email?: string;
  name?: string;
  password?: string;
  birthday?: string;
  avatar?: string;
}
export class SignUser {
  id: string;
  email?: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'CLUB';
}
