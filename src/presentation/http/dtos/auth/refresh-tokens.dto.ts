import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsJWT, IsString } from 'class-validator';

export class RefreshTokensBodyDTO {
  @ApiProperty({ description: 'Refresh token' })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refreshToken: string;
}

export class RefreshTokensResponseDTO {
  @ApiProperty({ description: 'Novo access token' })
  accessToken: string;

  @ApiProperty({ description: 'Novo refresh token' })
  refreshToken: string;
}
