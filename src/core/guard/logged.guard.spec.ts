import { ExecutionContext } from '@nestjs/common';
import { LoggedGuard } from './logged.guard';
import { TokenService } from '../token/token.service';

const tokenMock: TokenService = {
  verifyToken: jest.fn().mockResolvedValue({}),
} as unknown as TokenService;

describe('AuthGuard', () => {
  const loggedGuard = new LoggedGuard(tokenMock);
  it('should be defined', () => {
    expect(loggedGuard).toBeDefined();
  });

  describe('When we call canActivate method', () => {
    it('should return true', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer token',
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const result = await loggedGuard.canActivate(context);
      expect(result).toBe(true);
    });
  });
  describe('And there are NOT Authorization header', () => {
    it('should throw BadRequestException', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;
      try {
        await loggedGuard.canActivate(context);
      } catch (error) {
        expect(error.message).toBe('Authorization is required');
      }
    });
  });
  describe('And token is invalid', () => {
    it('should throw ForbiddenException', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer token',
            },
          }),
        }),
      } as ExecutionContext;
      tokenMock.compareToken = jest
        .fn()
        .mockRejectedValue(new Error('Invalid token'));
      try {
        await loggedGuard.canActivate(context);
      } catch (error) {
        expect(error.message).toBe('Invalid token');
      }
    });
  });
});
