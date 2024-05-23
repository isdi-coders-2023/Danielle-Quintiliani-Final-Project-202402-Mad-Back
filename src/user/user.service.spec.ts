import { Test, TestingModule } from '@nestjs/testing';
import { UserService, select } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UserUpdateDto } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ImgData } from './entities/avatar.entity';

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
    avatar: {
      delete: jest.fn().mockReturnValue({}),
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
      select,
    });
    expect(result).toEqual({ id: 1 });
  });
  it('should find for email a user', async () => {
    const result = await service.findForLogin('email');
    expect(mock.user.findUnique).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });
  describe('When we use the method create', () => {
    describe('And we do not provide an image', () => {
      it('Then it should return the created user', async () => {
        const data: CreateUserDto = {} as CreateUserDto;
        const result = await service.create(data, null);
        expect(mock.user.create).toHaveBeenCalled();
        expect(result).toEqual({ id: 2 });
      });
    });
    describe('And we provide an image', () => {
      it('Then it should return the created user with the image', async () => {
        const data: CreateUserDto = {} as CreateUserDto;
        const imgData = {} as ImgData;
        const result = await service.create(data, imgData);
        expect(mock.user.create).toHaveBeenCalled();
        expect(result).toEqual({ id: 2 });
      });
    });
    describe('When we use the method update', () => {
      describe('And we do not provide an image', () => {
        it('Then it should return the updated user', async () => {
          const data: Partial<UserUpdateDto> = {}; // Your data here
          const result = await service.update('3', data, null);
          expect(mock.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              where: { id: '3' },
              data: expect.objectContaining({ avatar: {} }),
            }),
          );
          expect(result).toEqual({ id: 3 });
        });
      });

      describe('And we provide an image', () => {
        it('Then it should return the updated user with the image', async () => {
          const data: Partial<UserUpdateDto> = {}; // Your data here
          const mockImageDto = {
            itemId: '',
            publicId: '',
            folder: '',
            fieldName: '',
            originalName: '',
            secureUrl: '',
            resourceType: '',
            mimetype: '',
            format: '',
            width: 1,
            height: 1,
            bytes: 1,
          }; // Your image data here
          const result = await service.update('3', data, mockImageDto);
          expect(mock.user.update).toHaveBeenCalledWith(
            expect.objectContaining({
              where: { id: '3' },
              data: expect.objectContaining({
                avatar: {},
              } as unknown as ImgData),
            }),
          );
          expect(result).toEqual({ id: 3 });
        });
      });
    });
    it('should update user adding to favorites', async () => {
      await service.addToFavorites('1', '2');
      expect(mock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: {
            favorite: {
              connect: { id: '2' },
            },
          },
          include: {
            favorite: true,
          },
        }),
      );
    });
    it('should update user removing from favorites', async () => {
      await service.removeFromFavorites('1', '2');
      expect(mock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: {
            favorite: {
              disconnect: { id: '2' },
            },
          },
          include: {
            favorite: true,
          },
        }),
      );
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
    test('should throw error on find for mail', async () => {
      const email = '';
      await expect(service.findForLogin(email)).rejects.toThrow(
        `User 1 not found`,
      );
    });
    test('should throw error on update', async () => {
      const userId = '3';
      await expect(service.update(userId, {}, null)).rejects.toThrow(
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
});
