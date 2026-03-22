import { HttpStatus } from '@nestjs/common';

import { ErrorsMap } from '@core/types';

export enum ErrorCode {
  NOT_FOUND = 'ResourceFavoriteNotFoundError',
  ALREADY_EXISTS = 'ResourceFavoriteAlreadyExistsError',
  NOT_DELETED = 'ResourceFavoriteNotDeletedError',
  PERMISSION_DENIED = 'ResourceFavoritePermissionDeniedError'
}

const errors: ErrorsMap<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Recurso favorito não encontrado',
      en_US: 'Resource favorite not found',
      es_ES: 'Recurso favorito no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.ALREADY_EXISTS]: () => ({
    message: {
      pt_BR: 'Este recurso já está favoritado para este usuário',
      en_US: 'This resource is already favorited for this user',
      es_ES: 'Este recurso ya está marcado como favorito para este usuario'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.NOT_DELETED]: () => ({
    message: {
      pt_BR: 'Erro ao remover recurso favorito',
      en_US: 'Error removing resource favorite',
      es_ES: 'Error al eliminar recurso favorito'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.PERMISSION_DENIED]: () => ({
    message: {
      pt_BR: 'Você não tem permissão para remover este recurso favorito',
      en_US: 'You do not have permission to remove this resource favorite',
      es_ES: 'No tienes permiso para eliminar este recurso favorito'
    },
    status: HttpStatus.FORBIDDEN
  })
};

export default errors;
