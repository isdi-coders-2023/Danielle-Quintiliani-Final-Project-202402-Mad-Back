import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UpdateItemDto } from './entities/item.entity';
import { FileService } from '../core/file/file.service';
import { Category } from './entities/item.entity';

const mockFiles = {
  uploadImage: jest.fn().mockResolvedValue([
    {
      publicId: '',
      folder: '',
      fieldName: '',
      originalName: '',
      secureUrl: '',
      resourceType: '',
      mimetype: '',
      format: 'jpg',
      width: 100,
      height: 100,
      bytes: 100,
    },
  ]),
} as unknown as FileService;

const mockItem = {
  create: jest.fn().mockResolvedValue({ id: 1 }),
  findAllItem: jest.fn().mockResolvedValue([{ id: 2 }]),
  findMyItem: jest.fn().mockResolvedValue({ id: 3 }),
  findByCategory: jest.fn().mockResolvedValue([{ id: 6 }]),
  updateItem: jest.fn().mockResolvedValue({ id: 4 }),
  removeItem: jest.fn().mockResolvedValue({ id: 5 }),
} as unknown as ItemService;

describe('ItemController', () => {
  let controller: ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        { provide: ItemService, useValue: mockItem },
        { provide: FileService, useValue: mockFiles },
        {
          provide: 'REPO_SERVICE',
          useValue: mockItem,
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('When we use the method create', () => {
    it('should create a item', async () => {
      const mockItemDto = {
        title: '',
        price: '',
        content: '',
        image: [],
        category: 'MOTO' as Category,
        ownerItemId: '',
      };
      const mockImage = [
        {
          fieldname: 'image',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test_image_data'),
          size: 1000,
        } as Express.Multer.File,
      ];
      const result = await controller.create(mockItemDto, mockImage);
      expect(mockItem.create).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });
    describe('When we use the method getAllItem', () => {
      it('should return all item', async () => {
        const result = await controller.findAll();
        expect(mockItem.findAllItem).toHaveBeenCalled();
        expect(result).toEqual([{ id: 2 }]);
      });
    });
    describe('When we use the method getMyItem', () => {
      it('should return the item with the id', async () => {
        const result = await controller.findOne('3');
        expect(mockItem.findMyItem).toHaveBeenCalled();
        expect(result).toEqual({ id: 3 });
      });
    });
    describe('When we use the method getCategory', () => {
      it('should return the item with the category', async () => {
        const result = await controller.getCategory('CLOTHES');
        expect(mockItem.findByCategory).toHaveBeenCalled();
        expect(result).toEqual([{ id: 6 }]);
      });
    });

    describe('When we use the method update', () => {
      it('should update a item', async () => {
        const mockItemDto = {
          password: '12345',
        } as UpdateItemDto;

        const result = await controller.update('4', mockItemDto);
        expect(mockItem.updateItem).toHaveBeenCalled();
        expect(result).toEqual({ id: 4 });
      });
    });
    describe('When we use the method delete', () => {
      it('should delete a item', async () => {
        const result = await controller.remove('5');
        expect(mockItem.removeItem).toHaveBeenCalled();
        expect(result).toEqual({ id: 5 });
      });
    });
  });
});
