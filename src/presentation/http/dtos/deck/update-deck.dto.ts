import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateDeckBodyDTO } from './create-deck.dto';

export class UpdateDeckParamsDTO {
  @ApiProperty({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  deckId: string;
}

export class UpdateDeckBodyDTO extends PartialType(CreateDeckBodyDTO) {}
