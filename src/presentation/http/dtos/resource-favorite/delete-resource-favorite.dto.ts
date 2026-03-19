import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteResourceFavoriteParamsDTO {
  @ApiProperty({
    description: 'ID do favorito',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsNotEmpty()
  @IsUUID()
  favoriteId: string;
}
