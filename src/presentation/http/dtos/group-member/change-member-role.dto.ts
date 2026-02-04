import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';

export class ChangeMemberRoleParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;

  @ApiProperty({
    description: 'ID do membro',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  memberId: number;
}

export class ChangeMemberRoleBodyDTO {
  @ApiProperty({
    description: 'Novo role do membro',
    enum: GroupMemberRole,
    example: GroupMemberRole.ADMIN
  })
  @IsNotEmpty()
  @IsEnum(GroupMemberRole)
  role: GroupMemberRole;
}
