import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { User } from '../../user/entities/user.entity';

const configMock: ConfigService = {
  get: jest.fn().mockReturnValue('SECRET_TOKEN'),
} as unknown as ConfigService;

const jwtMock: JwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
  verifyAsync: jest.fn().mockResolvedValue({}),
} as unknown as JwtService;

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
        TokenService,
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we call hash method', () => {
    it('should return hash', async () => {
      const value = 'value';
      const result = await service.hash(value);
      expect(hash).toHaveBeenCalledWith(value, 10);
      expect(result).toBe('hash');
    });
  });
  describe('When we call compare method', () => {
    it('should return a true', async () => {
      const value = 'value';
      const hash = 'hash';
      const result = await service.compare(value, hash);
      expect(compare).toHaveBeenCalledWith(value, hash);
      expect(result).toBe(true);
    });
  });
  describe('When we call createToken method', () => {
    it('should return a token', async () => {
      const user: Partial<User> = { id: '1', role: 'ADMIN', name: 'admin' };
      const result = await service.createToken(user);
      expect(jwtMock.signAsync).toHaveBeenCalledWith(
        { id: '1', role: 'ADMIN', name: 'admin' },
        { secret: 'SECRET_TOKEN' },
      );
      expect(result).toBe('token');
    });
  });
  describe('When we call verifyToken method', () => {
    it('should return a token', async () => {
      const token = 'token';
      const result = await service.compareToken(token);
      expect(jwtMock.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'SECRET_TOKEN',
      });
      expect(result).toEqual({});
    });
  });
});
