import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class LogoutBodyDTO {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}
