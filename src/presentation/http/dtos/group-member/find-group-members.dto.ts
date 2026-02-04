import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID } from 'class-validator';

import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';

import { GroupMemberResponseDTO } from './group-member-response.dto';

export class FindGroupMembersParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}

export class FindGroupMembersQueryDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por role do membro',
    enum: GroupMemberRole,
    example: GroupMemberRole.MEMBER
  })
  @IsOptional()
  @IsEnum(GroupMemberRole)
  role?: GroupMemberRole;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do usuário',
    example: 1
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  userId?: number;
}

export class FindGroupMembersResponseDTO {
  @ApiProperty({
    description: 'Lista de membros do grupo',
    type: [GroupMemberResponseDTO]
  })
  @Type(() => GroupMemberResponseDTO)
  members: GroupMemberResponseDTO[];

  @ApiProperty({
    description: 'Total de membros',
    example: 10
  })
  total: number;
}
