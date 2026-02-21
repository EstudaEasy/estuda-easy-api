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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';

import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { LogoutUseCase } from '@application/use-cases/auth/logout.use-case';
import { RefreshTokensUseCase } from '@application/use-cases/auth/refresh-tokens.use-case';
import { ResetPasswordUseCase } from '@application/use-cases/auth/reset-password.use-case';
import { SendPasswordResetEmailUseCase } from '@application/use-cases/auth/send-password-reset-email.use-case';
import {
  LoginBodyDTO,
  LoginResponseDTO,
  LogoutBodyDTO,
  RefreshTokensBodyDTO,
  RefreshTokensResponseDTO,
  ResetPasswordDTO,
  SendPasswordResetEmailBodyDTO
} from '@presentation/http/dtos/auth';
import { UserRefreshTokenGuard } from '@presentation/http/guards/users/user-refresh.guard';

@ApiTags('Autenticação')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ type: RefreshTokensResponseDTO })
  @ApiOperation({ summary: 'Renovar tokens de acesso' })
  @ApiOkResponse({ description: 'Tokens renovados com sucesso', type: RefreshTokensResponseDTO })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido' })
  async refresh(@Body() data: RefreshTokensBodyDTO, @Ip() ipAddress): Promise<RefreshTokensResponseDTO> {
    return await this.refreshTokensUseCase.execute({ refreshToken: data.refreshToken, ipAddress });
  }

  @Post('password/forgot')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Enviar e-mail para redefinição de senha' })
  @ApiNoContentResponse({ description: 'E-mail enviado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async sendPasswordResetEmail(@Body() data: SendPasswordResetEmailBodyDTO): Promise<void> {
    return await this.sendPasswordResetEmailUseCase.execute(data);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Enviar e-mail para redefinição de senha' })
  @ApiNoContentResponse({ description: 'Senha redefinida com sucesso' })
  @ApiBadRequestResponse({ description: 'Senha e confirmação de senha não conferem' })
  @ApiUnauthorizedResponse({ description: 'Token de redefinição inválido' })
  async resetPassword(@Body() data: ResetPasswordDTO): Promise<void> {
    return await this.resetPasswordUseCase.execute(data);
  }
}
