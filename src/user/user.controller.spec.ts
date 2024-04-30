import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserUpdateDto } from './entities/user.entity';

const mockUser = {
  create: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  findAll: jest.fn().mockResolvedValue({ id: 2 }),
  findOne: jest.fn().mockResolvedValue({ id: 3 }),
  update: jest.fn().mockResolvedValue({ id: 4 }),
  remove: jest.fn().mockResolvedValue({ id: 5 }),
} as unknown as UserService;

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUser }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When we use the method getAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(mockUser.findAll).toHaveBeenCalled();
      expect(result).toEqual({ id: 2 });
    });
  });
  describe('When we use the method getById', () => {
    it('should return the user with the id', async () => {
      const result = await controller.findOne('3');
      expect(mockUser.findOne).toHaveBeenCalled();
      expect(result).toEqual({ id: 3 });
    });
  });
  describe('When we use the method update', () => {
    it('should update a user', async () => {
      const mockUserDto = {
        password: '12345',
      } as UserUpdateDto;
      const result = await controller.update('4', mockUserDto);
      expect(mockUser.update).toHaveBeenCalled();
      expect(result).toEqual({ id: 4 });
    });
  });
  describe('When we use the method delete', () => {
    it('should delete a user', async () => {
      const result = await controller.remove('5');
      expect(mockUser.remove).toHaveBeenCalled();
      expect(result).toEqual({ id: 5 });
    });
  });
});
