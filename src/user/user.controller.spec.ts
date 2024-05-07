import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UserUpdateDto } from './entities/user.entity';
import { TokenService } from '../core/token/token.service';
import { LoggedGuard } from '../core/guard/logged.guard';
import { FileService } from '../core/file/file.service';

const mockUser = {
  create: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  findAll: jest.fn().mockResolvedValue({ id: 2 }),
  findForLogin: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({ id: 3 }),
  update: jest.fn().mockResolvedValue({ id: 4 }),
  remove: jest.fn().mockResolvedValue({ id: 5 }),
} as unknown as UserService;

const mockToken = {
  hash: jest.fn().mockResolvedValue('hash'),
  compare: jest.fn().mockResolvedValue(true),
  createToken: jest.fn().mockResolvedValue('token'),
};
const mockFileService = {
  uploadImage: jest.fn().mockResolvedValue({}),
};
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUser },
        {
          provide: TokenService,
          useValue: mockToken,
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    })
      .overrideGuard(LoggedGuard)
      .useValue(jest.fn().mockReturnValue(true))
      .compile();

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
      const mockFile = {} as Express.Multer.File;
      const result = await controller.update('4', mockUserDto, mockFile);
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

  describe('When we use the method loginWithToken', () => {
    it('should return a token', async () => {
      const mockPayload = { id: '1' };
      const result = await controller.loginWithToken({ payload: mockPayload });
      expect(mockUser.findOne).toHaveBeenCalled();
      expect(result).toEqual({ token: 'token' });
    });
  });

  it('should throw an error if user is not found', async () => {
    const mockPayload = { id: '1' };
    (mockUser.findOne as jest.Mock).mockResolvedValueOnce(null);
    try {
      await controller.loginWithToken({ payload: mockPayload });
    } catch (error) {
      expect(error.message).toEqual('Email or password invalid');
    }
  });
  describe('When we use the method login', () => {
    it('should return a token', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      const result = await controller.login(mockUserDto);
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw an error if email or password are missing', async () => {
      const mockUserDto = {
        email: '',
        password: '',
      } as CreateUserDto;

      await expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email or password are required',
      );
    });
    it('should throw an error if user is not found', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      (mockUser.findForLogin as jest.Mock).mockResolvedValueOnce(null);
      await expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email or password invalid',
      );
    });
  });
});
