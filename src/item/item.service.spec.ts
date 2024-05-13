import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './entities/item.entity';
import { NotFoundException } from '@nestjs/common';

const itemMock = {
  item: {
    findMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    findUnique: jest.fn().mockResolvedValue({ id: 1 }),
    create: jest.fn().mockResolvedValue({ id: 2 }),
    update: jest.fn().mockResolvedValue({ id: 3 }),
    delete: jest.fn().mockResolvedValue({ id: 4 }),
  },
};

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: itemMock,
        },
        ItemService,
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll a item', async () => {
    const result = await service.findAllItem();
    expect(itemMock.item.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('should findOne a item', async () => {
    const result = await service.findMyItem('1');
    expect(itemMock.item.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual({ id: 1 });
  });
  it('should return the created item', async () => {
    const files = new Array(2).fill({} as Express.Multer.File);

    const data: CreateItemDto = {} as CreateItemDto;
    const result = await service.create(data, files);
    expect(itemMock.item.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 2 });
  });
  it('should Update a item', async () => {
    const result = await service.updateItem(
      '3',
      {} as unknown as Partial<UpdateItemDto>,
    );
    expect(itemMock.item.update).toHaveBeenCalledTimes(1);
    expect(itemMock.item.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: '3' } }),
    );
    expect(result).toEqual({ id: 3 });
  });
  it('should remove a item', async () => {
    const result = await service.removeItem('4');
    expect(itemMock.item.delete).toHaveBeenCalledTimes(1);
    expect(itemMock.item.delete).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: '4' } }),
    );
    expect(result).toEqual({ id: 4 });
  });
  describe('ItemService throw error', () => {
    let service: ItemService;
    const mockPrismaService = {
      item: {
        findUnique: jest.fn().mockRejectedValue(new Error('Item 1 not found')),
        update: jest.fn().mockRejectedValue(new Error('Item 3 not found')),
        delete: jest.fn().mockRejectedValue(new Error('Item 4 not found')),
      },
    };
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
          ItemService,
        ],
      }).compile();
      service = module.get<ItemService>(ItemService);
    });
    test('should throw error on findOne', async () => {
      const id = '1';
      await expect(service.findMyItem(id)).rejects.toThrow(
        new NotFoundException(`Item 1 not found`),
      );
    });
    test('should throw error on update', async () => {
      const id = '3';
      await expect(service.updateItem(id, {})).rejects.toThrow(
        `Item ${id} not found`,
      );
    });
    test('should throw error on remove', async () => {
      const id = '4';
      await expect(service.removeItem(id)).rejects.toThrow(
        `Item ${id} not found`,
      );
    });
  });
});
