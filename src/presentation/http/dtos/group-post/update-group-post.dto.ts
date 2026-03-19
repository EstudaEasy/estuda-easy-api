import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateGroupPostBodyDTO } from './create-group-post.dto';

export class UpdateGroupPostParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @ApiProperty({
    description: 'ID do post',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}

export class UpdateGroupPostBodyDTO extends PartialType(CreateGroupPostBodyDTO) {}
