import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateWhiteboardBodyDTO } from './create-whiteboard.dto';

export class UpdateWhiteboardParamsDTO {
  @ApiProperty({
    description: 'ID do whiteboard',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  whiteboardId: string;
}

export class UpdateWhiteboardBodyDTO extends PartialType(CreateWhiteboardBodyDTO) {}
