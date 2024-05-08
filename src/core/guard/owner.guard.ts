import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RepoFindId } from '../../item/item.module';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @Inject('REPO_SERVICE') private repo: RepoFindId,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.payload) {
      throw new ForbiddenException('CreatorGuard No Payload');
    }
    const userId = req.payload.id;
    const itemId = req.params.id;
    const item = await this.repo.findMyItem(itemId);
    const ownerKey = this.reflector.get<string>(
      'ownerKey',
      context.getHandler(),
    );
    const creatorId = item[ownerKey].id;

    if (userId === creatorId) {
      return true;
    }

    return false;
  }
}
