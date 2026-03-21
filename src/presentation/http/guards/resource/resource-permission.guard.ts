import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

import { AuthenticatedUser } from '@adapters/auth/types/auth-user.type';
import { ResourcePermissionService } from '@application/services/resource/resource-permission.service';
import { ResourceType } from '@domain/resource/resource.interface';
import { SharePermission } from '@domain/resource-share/resource-share.interface';
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
    const entityId = params[metadata.param] as string;

    if (!entityId) {
      this.logger.warn(`ResourcePermissionGuard: Param '${metadata.param}' not found in route.`);
      return false;
    }

    await this.permissionService.verifyOrThrow(
      entityId,
      user.id,
      metadata.type as ResourceType,
      metadata.permissions as SharePermission[]
    );

    return true;
  }
}
