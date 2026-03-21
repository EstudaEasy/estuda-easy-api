import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsPassword } from '@presentation/validators/is-password.validator';

export class ResetPasswordDTO {
  @ApiProperty({ description: 'Token de redefinição de senha' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: `Nova senha do usuário 
    (deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial)`
  })
  @IsNotEmpty()
  @IsPassword(8, 20)
  password: string;

  @ApiProperty({ description: 'Confirmação da nova senha' })
  @IsNotEmpty()
  @IsPassword(8, 20)
  passwordConfirmation: string;
}
