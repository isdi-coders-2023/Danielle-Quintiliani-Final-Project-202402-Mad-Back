import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { FileService } from '../core/file/file.service';
const mock = {
  create: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
} as unknown as ImageService;

const mockFileService = {
  uploadImage: jest.fn().mockResolvedValue({}),
};

describe('ImageController', () => {
  let controller: ImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        { provide: ImageService, useValue: mock },
        {
          provide: FileService,
          useValue: mockFileService,
        },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a image', async () => {
    const id = { id: '1' };
    const data1 = {} as Express.Multer.File;

    const result = await controller.create(id, data1);
    expect(result).toEqual({});
  });
  it('should remove a image', async () => {
    const id = '1';
    const result = await controller.remove(id);
    expect(result).toEqual({});
  });
});
