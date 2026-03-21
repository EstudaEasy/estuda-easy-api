import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

import { SharePermission } from '@domain/resource-share/resource-share.interface';

export class UpdateResourceShareParamsDTO {
  @ApiProperty({
    description: 'ID do compartilhamento',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  shareId: number;
}

export class UpdateResourceShareBodyDTO {
  @ApiProperty({
    description: 'Nova permissão do compartilhamento',
    enum: SharePermission,
    example: SharePermission.EDIT
  })
  @IsNotEmpty()
  @IsEnum(SharePermission)
  permission: SharePermission;
}
