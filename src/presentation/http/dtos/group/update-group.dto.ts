import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateGroupBodyDTO } from './create-group.dto';

export class UpdateGroupParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}

export class UpdateGroupBodyDTO extends PartialType(CreateGroupBodyDTO) {}
