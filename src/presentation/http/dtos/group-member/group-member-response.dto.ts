import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';

import { UserResponseDTO } from '../user/user-response.dto';

@Exclude()
export class GroupMemberResponseDTO {
  @ApiProperty({
    description: 'ID único do membro',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Role do membro no grupo',
    enum: GroupMemberRole,
    example: GroupMemberRole.MEMBER
  })
  @Expose()
  role: GroupMemberRole;

  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  groupId: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  @Expose()
  userId: number;

  @ApiPropertyOptional({
    description: 'Dados do usuário',
    type: UserResponseDTO
  })
  @Expose()
  @Type(() => UserResponseDTO)
  user?: UserResponseDTO;

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
