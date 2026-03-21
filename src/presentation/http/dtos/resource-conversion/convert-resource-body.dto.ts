import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

import { ConvertibleTargetType } from '@application/use-cases/resource-conversion/types';
import { ResourceType } from '@domain/resource/resource.interface';

const CONVERTIBLE_TARGET_TYPES: ConvertibleTargetType[] = [ResourceType.QUIZ, ResourceType.DECK, ResourceType.TASK];

export class ConvertResourceBodyDTO {
  @ApiProperty({
    description: 'ID do recurso de origem a ser convertido',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  sourceResourceId: string;

  @ApiProperty({
    description: 'Tipo de recurso de destino',
    enum: CONVERTIBLE_TARGET_TYPES,
    example: ResourceType.QUIZ
  })
  @IsEnum(CONVERTIBLE_TARGET_TYPES)
  targetResourceType: (typeof CONVERTIBLE_TARGET_TYPES)[number];
}
