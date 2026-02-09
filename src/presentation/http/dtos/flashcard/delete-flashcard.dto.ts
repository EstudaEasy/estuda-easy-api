import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class DeleteFlashcardParamsDTO {
  @ApiProperty({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  deckId: string;

  @ApiProperty({ description: 'ID do flashcard', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  flashcardId: number;
}
