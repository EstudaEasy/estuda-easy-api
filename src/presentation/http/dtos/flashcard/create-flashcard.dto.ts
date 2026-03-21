import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, Length } from 'class-validator';

export class CreateFlashcardParamsDTO {
  @ApiProperty({
    description: 'ID do deck',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  deckId: string;
}

export class CreateFlashcardBodyDTO {
  @ApiProperty({
    description: 'Frente do flashcard (pergunta)',
    example: 'Qual é a capital da França?',
    minLength: 1,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  front: string;

  @ApiProperty({
    description: 'Verso do flashcard (resposta)',
    example: 'Paris',
    minLength: 1,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  back: string;

  @ApiProperty({
    description: 'Posição do flashcard no deck',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  position: number;
}
