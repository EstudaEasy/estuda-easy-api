import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, IsDate, IsPhoneNumber } from 'class-validator';
import { IsPassword } from '@presentation/validators/is-password.validator';
import { Type } from 'class-transformer';

export class CreateUserBodyDTO {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (deve conter pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial)',
    example: 'Senha@123',
    minLength: 8,
    maxLength: 20
  })
  @IsNotEmpty()
  @IsPassword(8, 20)
  password: string;

  @ApiPropertyOptional({
    description: 'Número de telefone do usuário',
    example: '+55 11 98765-4321'
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento do usuário',
    example: '1990-01-15'
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthdate?: Date;
}
