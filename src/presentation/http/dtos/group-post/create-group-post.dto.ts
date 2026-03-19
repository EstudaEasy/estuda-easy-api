import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateGroupPostParamsDTO {
  @ApiProperty({
    description: 'ID do grupo',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
}

export class CreateGroupPostBodyDTO {
  @ApiProperty({
    description: 'Conteúdo do post no grupo',
    example: 'Vamos revisar matemática às 19h hoje!',
    minLength: 1,
    maxLength: 5000
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 5000)
  content: string;
}
