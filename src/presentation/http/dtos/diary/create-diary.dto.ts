import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateDiaryBodyDTO {
  @ApiProperty({
    description: 'Título do diário',
    example: 'Meu dia de estudos',
    minLength: 3,
    maxLength: 200
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  title: string;

  @ApiProperty({
    description: 'Conteúdo do diário',
    example: 'Hoje estudei matemática e física...'
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'URL do áudio do diário',
    example: 'https://example.com/audio.mp3'
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  audioUrl?: string;
}
