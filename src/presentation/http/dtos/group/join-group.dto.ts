import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinGroupBodyDTO {
  @ApiProperty({
    description: 'Código de convite do grupo',
    example: 'ABC12345',
    minLength: 8,
    maxLength: 8
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  inviteCode: string;
}
