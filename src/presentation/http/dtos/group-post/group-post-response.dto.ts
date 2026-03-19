import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { UserResponseDTO } from '../user/user-response.dto';

@Exclude()
export class GroupPostResponseDTO {
  @ApiProperty({
    description: 'ID único do post',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Conteúdo do post no grupo',
    example: 'Vamos revisar matemática às 19h hoje!'
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'ID do grupo ao qual o post pertence',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  groupId: string;

  @ApiProperty({
    description: 'ID do autor do post',
    example: 12
  })
  @Expose()
  authorId: number;

  @ApiPropertyOptional({
    description: 'Dados do autor do post',
    type: UserResponseDTO
  })
  @Expose()
  @Type(() => UserResponseDTO)
  author?: UserResponseDTO;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
