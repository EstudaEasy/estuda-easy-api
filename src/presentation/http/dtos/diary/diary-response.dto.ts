import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DiaryResponseDTO {
  @ApiProperty({
    description: 'ID único do diário',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Título do diário',
    example: 'Meu dia de estudos'
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Conteúdo do diário',
    example: 'Hoje estudei matemática e física...'
  })
  @Expose()
  content: string;

  @ApiPropertyOptional({
    description: 'URL do áudio do diário',
    example: 'https://example.com/audio.mp3'
  })
  @Expose()
  audioUrl?: string;

  @ApiProperty({
    description: 'ID do recurso associado ao quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  resourceId: string;

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
