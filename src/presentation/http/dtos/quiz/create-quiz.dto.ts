import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateQuizBodyDTO {
  @ApiProperty({
    description: 'Título do quiz',
    example: 'Quiz de Matemática',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição do quiz',
    example: 'Um quiz sobre matemática básica',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Ícone do quiz',
    example: 'book svg'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Cor do quiz (hex)',
    example: '#FF0000'
  })
  @IsOptional()
  @IsHexColor()
  color?: string;
}
