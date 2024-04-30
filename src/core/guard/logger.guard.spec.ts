import { ExecutionContext, Logger } from '@nestjs/common';
import { LoggerGuard } from './logger.guard';

describe('LoggerGuard', () => {
  const logger = new Logger();
  const logGuard = new LoggerGuard(logger);
  it('should be defined', () => {
    expect(logGuard).toBeDefined();
  });
  describe('canActivate', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: '',
          params: { id: 'item_1234' },
        }),
      }),
      getClass: () => 'class',
    } as unknown as ExecutionContext;
    jest.spyOn(logger, 'log');
    it('should return true', () => {
      const result = logGuard.canActivate(context);
      expect(logger.log).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
