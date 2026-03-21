import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateGroupBodyDTO {
  @ApiProperty({
    description: 'Nome do grupo',
    example: 'Grupo de Estudos de Matemática',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do grupo',
    example: 'Grupo dedicado aos estudos de matemática avançada',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
