import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDTO } from './user-response.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class FindUserQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do usuário',
    example: 1
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com'
  })
  @IsOptional()
  @IsString()
  email?: string;
}

export class FindUserResponseDTO {
  @ApiProperty({ description: 'Lista de usuários', type: [UserResponseDTO] })
  @Type(() => UserResponseDTO)
  users: UserResponseDTO[];

  @ApiProperty({ description: 'Total de usuários encontrados', example: 10 })
  total: number;
}
