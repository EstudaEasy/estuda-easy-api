import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDeckBodyDTO {
  @ApiProperty({
    description: 'Nome do deck',
    example: 'Vocabulário de Inglês',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do deck',
    example: 'Flashcards para estudar vocabulário em inglês',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
