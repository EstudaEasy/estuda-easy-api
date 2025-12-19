import { UserRole } from '@domain/entities/user/user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDTO {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com'
  })
  @Expose()
  email: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento do usuário',
    example: '1990-01-15T00:00:00.000Z'
  })
  @Expose()
  birthdate?: Date;

  @ApiPropertyOptional({
    description: 'Número de telefone do usuário',
    example: '+55 11 98765-4321'
  })
  @Expose()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'URL da foto de perfil do usuário',
    example: 'https://example.com/photos/user.jpg'
  })
  @Expose()
  photoUrl?: string;

  @ApiProperty({
    description: 'Papel do usuário',
    example: UserRole.USER,
    enum: UserRole
  })
  @Expose()
  role: UserRole;

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
