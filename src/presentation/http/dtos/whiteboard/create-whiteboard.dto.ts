import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, Length } from 'class-validator';

export class CreateWhiteboardBodyDTO {
  @ApiProperty({
    description: 'Título do whiteboard',
    example: 'Brainstorming de Projeto',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    description: 'Dados do whiteboard em formato JSON'
  })
  @IsNotEmpty()
  @IsObject()
  content: any;
}
