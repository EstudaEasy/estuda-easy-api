import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { AuthenticatedUser } from '@adapters/jwt/strategies/types/authenticated-user.type';
import { ResourcePermissionService } from '@application/services/resource/resource-permission.service';
import {
  RESOURCE_PERMISSION_KEY,
  ResourcePermissionMetadata
} from '@presentation/http/decorators/resource-permission.decorator';

@Injectable()
export class ResourcePermissionGuard implements CanActivate {
  private logger = new Logger(ResourcePermissionGuard.name);
  private permissionService: ResourcePermissionService;

  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef
  ) {}

  async onModuleInit() {
    this.permissionService = await this.moduleRef.get(ResourcePermissionService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<ResourcePermissionMetadata>(RESOURCE_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!metadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user || !user.id) {
      return false;
    }

    const params = request.params;
    const resourceId = params[metadata.param] as string;

    if (!resourceId) {
      this.logger.warn(`ResourcePermissionGuard: Param '${metadata.param}' not found in route.`);
      return false;
    }

    await this.permissionService.verifyOrThrow(resourceId, user.id, metadata.permissions);
    return true;
  }
}
