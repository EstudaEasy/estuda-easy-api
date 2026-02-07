import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  INSUFFICIENT_PERMISSIONS = 'ResourceInsufficientPermissionsError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: {
    message: {
      pt_BR: 'Permissões insuficientes para acessar o recurso',
      en_US: 'Insufficient permissions to access the resource',
      es_ES: 'Permisos insuficientes para acceder al recurso'
    },
    status: HttpStatus.FORBIDDEN
  }
};

export default errors;
