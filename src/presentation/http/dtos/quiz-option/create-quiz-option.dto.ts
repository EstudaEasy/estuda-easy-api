import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateQuizOptionDTO {
  @ApiProperty({
    description: 'Texto da opção',
    example: 'Opção A',
    minLength: 1,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  text: string;

  @ApiProperty({
    description: 'Indica se a opção é a correta',
    example: true
  })
  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({
    description: 'Ordem da opção',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  position: number;
}
