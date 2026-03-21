import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '@core/types';

export enum ErrorCode {
  INVALID_CREDENTIALS = 'AuthInvalidCredentialsError',
  REFRESH_TOKEN_NOT_FOUND = 'AuthRefreshTokenNotFoundError',
  INVALID_REFRESH_TOKEN = 'AuthInvalidRefreshTokenError',
  INVALID_PASSWORD_RESET_TOKEN = 'AuthInvalidPasswordResetTokenError',
  PASSWORD_CONFIRMATION_MISMATCH = 'AuthPasswordConfirmationMismatchError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.INVALID_CREDENTIALS]: () => ({
    message: {
      pt_BR: 'Credenciais inválidas',
      en_US: 'Invalid credentials',
      es_ES: 'Credenciales inválidas'
    },
    status: HttpStatus.UNAUTHORIZED
  }),
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Token de atualização não encontrado',
      en_US: 'Refresh token not found',
      es_ES: 'Token de actualización no encontrado'
    },
    status: HttpStatus.UNAUTHORIZED
  }),
  [ErrorCode.INVALID_REFRESH_TOKEN]: () => ({
    message: {
      pt_BR: 'Token de atualização inválido',
      en_US: 'Invalid refresh token',
      es_ES: 'Token de actualización inválido'
    },
    status: HttpStatus.UNAUTHORIZED
  }),
  [ErrorCode.INVALID_PASSWORD_RESET_TOKEN]: () => ({
    message: {
      pt_BR: 'Token de redefinição de senha inválido',
      en_US: 'Invalid password reset token',
      es_ES: 'Token de restablecimiento de contraseña inválido'
    },
    status: HttpStatus.UNAUTHORIZED
  }),
  [ErrorCode.PASSWORD_CONFIRMATION_MISMATCH]: () => ({
    message: {
      pt_BR: 'Confirmação de senha não confere',
      en_US: 'Password confirmation does not match',
      es_ES: 'La confirmación de contraseña no coincide'
    },
    status: HttpStatus.BAD_REQUEST
  })
};

export default errors;
