import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '@core/types';

export enum ErrorCode {
  NOT_FOUND = 'ResourceNotFoundError',
  INSUFFICIENT_PERMISSIONS = 'ResourceInsufficientPermissionsError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Recurso não encontrado',
      en_US: 'Resource not found',
      es_ES: 'Recurso no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: () => ({
    message: {
      pt_BR: 'Permissões insuficientes para acessar o recurso',
      en_US: 'Insufficient permissions to access the resource',
      es_ES: 'Permisos insuficientes para acceder al recurso'
    },
    status: HttpStatus.FORBIDDEN
  })
};

export default errors;
