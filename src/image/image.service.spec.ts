import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { PrismaService } from '../prisma/prisma.service';

const mock = {
  itemImg: {
    create: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
};

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mock,
        },
        ImageService,
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a image', async () => {
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
    };

    const result = await service.create(mockImageDto);
    expect(mock.itemImg.create).toHaveBeenCalled();
    expect(result).toEqual({});
  });
  it('should remove a image', async () => {
    const id = '1';
    const result = await service.remove(id);
    expect(mock.itemImg.delete).toHaveBeenCalled();
    expect(result).toEqual({});
  });
});
