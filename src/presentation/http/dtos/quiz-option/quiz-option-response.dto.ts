import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QuizOptionResponseDTO {
  @ApiProperty({
    description: 'ID único da opção',
    example: 1
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'ID do item do quiz',
    example: 1
  })
  @Expose()
  quizItemId: number;

  @ApiProperty({
    description: 'Texto da opção',
    example: 'Opção A'
  })
  @Expose()
  text: string;

  @ApiProperty({
    description: 'Indica se a opção é a correta',
    example: true
  })
  @Expose()
  isCorrect: boolean;

  @ApiProperty({
    description: 'Ordem da opção',
    example: 1
  })
  @Expose()
  position: number;
}
