import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';

export class GenerateResourceShareLinkParamsDTO {
  @ApiProperty({
    description: 'ID do recurso',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}

export class GenerateResourceShareLinkBodyDTO {
  @ApiProperty({
    description: 'Permissão concedida ao acessar o link',
    enum: SharePermission,
    example: SharePermission.READ
  })
  @IsNotEmpty()
  @IsEnum(SharePermission)
  permission: SharePermission;
}
