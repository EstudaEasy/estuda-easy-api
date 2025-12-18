import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginBodyDTO {
  @ApiProperty({ description: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDTO {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}
