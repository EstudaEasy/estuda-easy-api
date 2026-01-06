import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  INVALID_CREDENTIALS = 'AuthInvalidCredentialsError',
  REFRESH_TOKEN_NOT_FOUND = 'AuthRefreshTokenNotFoundError',
  INVALID_REFRESH_TOKEN = 'AuthInvalidRefreshTokenError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.INVALID_CREDENTIALS]: {
    message: {
      pt_BR: 'Credenciais inválidas',
      en_US: 'Invalid credentials',
      es_ES: 'Credenciales inválidas'
    },
    status: HttpStatus.UNAUTHORIZED
  },
  [ErrorCode.REFRESH_TOKEN_NOT_FOUND]: {
    message: {
      pt_BR: 'Token de atualização não encontrado',
      en_US: 'Refresh token not found',
      es_ES: 'Token de actualización no encontrado'
    },
    status: HttpStatus.UNAUTHORIZED
  },
  [ErrorCode.INVALID_REFRESH_TOKEN]: {
    message: {
      pt_BR: 'Token de atualização inválido',
      en_US: 'Invalid refresh token',
      es_ES: 'Token de actualización inválido'
    },
    status: HttpStatus.UNAUTHORIZED
  }
};

export default errors;
