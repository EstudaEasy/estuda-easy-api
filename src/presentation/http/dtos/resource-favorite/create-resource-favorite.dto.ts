import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateResourceFavoriteBodyDTO {
  @ApiProperty({
    description: 'ID do recurso a ser marcado como favorito',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}
