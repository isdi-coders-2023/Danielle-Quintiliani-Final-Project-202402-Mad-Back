import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { User } from '../../user/entities/user.entity';

export type Payload = {
  id: string;
  role: string;
  name: string;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hash(value: string) {
    return hash(value, 10);
  }
  async compare(value: string, hash: string) {
    return compare(value, hash);
  }
  async createToken({ id, role, name }: Partial<User>) {
    const payload: Payload = { id, role, name };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_TOKEN'),
    });
    return token;
  }

  async compareToken(token: string) {
    return this.jwtService.verifyAsync<Payload>(token, {
      secret: this.configService.get('SECRET_TOKEN'),
    });
  }
}
