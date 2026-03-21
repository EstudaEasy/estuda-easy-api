import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendPasswordResetEmailBodyDTO {
  @ApiProperty({ description: 'E-mail do usuário', example: 'joao.silva@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
