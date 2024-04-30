import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './entities/create-user.dto';
import { UserUpdateDto } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService with good response', () => {
  let service: UserService;
  const mock = {
    user: {
      findMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
      findUnique: jest.fn().mockResolvedValue({ id: 1 }),
      create: jest.fn().mockResolvedValue({ id: 2 }),
      update: jest.fn().mockResolvedValue({ id: 3 }),
      delete: jest.fn().mockResolvedValue({ id: 4 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mock,
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll a user', async () => {
    const result = await service.findAll();
    expect(mock.user.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('should findOne a user', async () => {
    const result = await service.findOne('1');
    expect(mock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual({ id: 1 });
  });
  it('should ReadByEmail a user', async () => {
    const result = await service.findByEmail('daniele@test.com');
    expect(mock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'daniele@test.com' },
    });
    expect(result).toEqual({ id: 1 });
  });
  it('should Create a user', async () => {
    const result = await service.create({} as unknown as CreateUserDto);
    expect(mock.user.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 2 });
  });
  it('should Update a user', async () => {
    const result = await service.update(
      '3',
      {} as unknown as Partial<UserUpdateDto>,
    );
    expect(mock.user.update).toHaveBeenCalledTimes(1);
    expect(mock.user.update).toHaveBeenCalledWith({
      where: { id: '3' },
      data: {},
    });
    expect(result).toEqual({ id: 3 });
  });
});
describe('UserService throw error', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockRejectedValue(new Error('User 1 not found')),
      update: jest.fn().mockRejectedValue(new Error('User 3 not found')),
      delete: jest.fn().mockRejectedValue(new Error('User 4 not found')),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  test('should throw error on findOne', async () => {
    const userId = '1';
    await expect(service.findOne(userId)).rejects.toThrow(
      new NotFoundException(`User 1 not found`),
    );
  });
  test('should throw error on findByEmail', async () => {
    const email = '';
    await expect(service.findByEmail(email)).rejects.toThrow(
      `User with email ${email} not found`,
    );
  });
  test('should throw error on update', async () => {
    const userId = '3';
    await expect(service.update(userId, {})).rejects.toThrow(
      `User ${userId} not found`,
    );
  });
  test('should throw error on remove', async () => {
    const userId = '4';
    await expect(service.remove(userId)).rejects.toThrow(
      `User ${userId} not found, can't remove`,
    );
  });
});
