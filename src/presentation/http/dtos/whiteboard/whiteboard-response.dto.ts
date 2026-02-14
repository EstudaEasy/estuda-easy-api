import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WhiteboardResponseDTO {
  @ApiProperty({
    description: 'ID único do whiteboard',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Título do whiteboard',
    example: 'Brainstorming de Projeto'
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Dados do whiteboard em formato JSON'
  })
  @Expose()
  content: any;

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
