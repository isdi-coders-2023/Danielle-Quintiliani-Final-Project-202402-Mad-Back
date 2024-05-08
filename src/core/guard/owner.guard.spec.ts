import { Reflector } from '@nestjs/core';
import { RepoFindId } from '../../item/item.module';

import { ExecutionContext } from '@nestjs/common';
import { OwnerGuard } from './owner.guard';

const mockRepoService: RepoFindId = {
  findMyItem: jest.fn().mockResolvedValue({
    creator: { id: 'user_1234' },
  }),
};

const reflector: Reflector = {
  get: jest.fn().mockReturnValue('creator'),
} as unknown as Reflector;

describe('CreatorGuard', () => {
  const creatorGuard = new OwnerGuard(mockRepoService, reflector);

  it('should be defined', () => {
    expect(creatorGuard).toBeDefined();
  });

  describe('When we call canActivate method without previous login (NOT request payload)', () => {
    it('should throw an error', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { id: 'item_1234' },
          }),
        }),
        getHandler: () => 'handler',
      } as unknown as ExecutionContext;
      await expect(creatorGuard.canActivate(context)).rejects.toThrow(
        'CreatorGuard No Payload',
      );
    });
  });

  describe('When we call canActivate method', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          payload: { id: 'user_1234' },
          params: { id: 'item_1234' },
        }),
      }),
      getHandler: () => 'handler',
    } as unknown as ExecutionContext;

    it('should return true if the user is the creator of the task', async () => {
      const result = await creatorGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should return false if the user is not the creator of the task', async () => {
      (mockRepoService.findMyItem as jest.Mock).mockResolvedValueOnce({
        creator: { id: 'anotherUserId' },
      });
      const result = await creatorGuard.canActivate(context);
      expect(result).toBe(false);
    });
  });
});
