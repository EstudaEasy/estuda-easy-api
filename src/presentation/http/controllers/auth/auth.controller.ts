import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNoContentResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case';
import { RefreshTokensUseCase } from '@application/use-cases/auth/refresh-tokens.use-case';
import { UserRefreshTokenGuard } from '@presentation/http/guards/users/user-refresh.guard';

import { LoginBodyDTO, LoginResponseDTO } from '../../dtos/auth/login.dto';
import { LogoutBodyDTO } from '../../dtos/auth/logout.dto';
import { RefreshTokensBodyDTO, RefreshTokensResponseDTO } from '../../dtos/auth/refresh-tokens.dto';

@ApiTags('Autenticação')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase
  ) {}

  @Post('login')
  @SerializeOptions({ type: LoginResponseDTO })
  @ApiOperation({ summary: 'Fazer login' })
  @ApiOkResponse({ description: 'Login realizado com sucesso', type: LoginResponseDTO })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async login(@Body() data: LoginBodyDTO, @Ip() ipAddress): Promise<LoginResponseDTO> {
    return await this.loginUseCase.execute({ email: data.email, password: data.password, ipAddress });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Fazer logout' })
  @ApiNoContentResponse({ description: 'Logout realizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido' })
  @UseGuards(UserRefreshTokenGuard)
  async logout(@Body() data: LogoutBodyDTO): Promise<void> {
    return await this.logoutUseCase.execute({ refreshToken: data.refreshToken });
  }

  @Post('refresh')
  @SerializeOptions({ type: RefreshTokensResponseDTO })
  @ApiOperation({ summary: 'Renovar tokens de acesso' })
  @ApiOkResponse({ description: 'Tokens renovados com sucesso', type: RefreshTokensResponseDTO })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido' })
  async refresh(@Body() data: RefreshTokensBodyDTO, @Ip() ipAddress): Promise<RefreshTokensResponseDTO> {
    return await this.refreshTokensUseCase.execute({ refreshToken: data.refreshToken, ipAddress });
  }
}
