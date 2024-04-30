import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoggerGuard implements CanActivate {
  constructor(private logger: Logger) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { originalUrl, method } = req;
    this.logger.log(
      `Request URL: [${method.toUpperCase()}] ${originalUrl}`,
      `LogGuard: ${context.getClass().name}`,
    );
    return true;
  }
}
