import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { v2 } from 'cloudinary';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('When we use the method uploadImage', () => {
    const uploadStream = (
      _op: any,
      cb: (error: Error | null, result: string) => void,
    ) => {
      cb(null, 'result');
      return { end: jest.fn() };
    };

    v2.uploader = {
      upload_stream: jest.fn().mockImplementation(uploadStream),
    } as unknown as typeof v2.uploader;

    it('Then it should upload an image', async () => {
      const file = {} as Express.Multer.File;
      const result = await service.uploadImage('owner', file);
      expect(result).toEqual('result');
    });
  });
  describe('When we use the method uploadImage and it fails', () => {
    it('Then it should throw an error', async () => {
      const uploadStreamError = (
        _op: any,
        cb: (error: Error | null, result: string) => void,
      ) => {
        cb(new Error('error'), 'result');
        return { end: jest.fn() };
      };

      v2.uploader = {
        upload_stream: jest.fn().mockImplementation(uploadStreamError),
      } as unknown as typeof v2.uploader;

      const file = {} as Express.Multer.File;
      await expect(service.uploadImage('owner', file)).rejects.toThrow('error');
    });
  });
});
