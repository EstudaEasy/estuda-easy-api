import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GroupResponseDTO {
  @ApiProperty({
    description: 'ID único do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nome do grupo',
    example: 'Grupo de Estudos de Matemática'
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do grupo',
    example: 'Grupo dedicado aos estudos de matemática avançada'
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Código de convite do grupo',
    example: 'ABC12345'
  })
  @Expose()
  inviteCode: string;

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
