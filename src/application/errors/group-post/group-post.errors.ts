import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '@core/types';

export enum ErrorCode {
  NOT_FOUND = 'GroupPostNotFoundError',
  NOT_UPDATED = 'GroupPostNotUpdatedError',
  NOT_DELETED = 'GroupPostNotDeletedError',
  PERMISSION_DENIED = 'GroupPostPermissionDeniedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Post do grupo não encontrado',
      en_US: 'Group post not found',
      es_ES: 'Publicación del grupo no encontrada'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.NOT_UPDATED]: () => ({
    message: {
      pt_BR: 'Erro ao atualizar o post do grupo',
      en_US: 'Error updating group post',
      es_ES: 'Error al actualizar la publicación del grupo'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.NOT_DELETED]: () => ({
    message: {
      pt_BR: 'Erro ao deletar o post do grupo',
      en_US: 'Error deleting group post',
      es_ES: 'Error al eliminar la publicación del grupo'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.PERMISSION_DENIED]: () => ({
    message: {
      pt_BR: 'Permissão negada para acessar ou modificar o post do grupo',
      en_US: 'Permission denied to access or modify the group post',
      es_ES: 'Permiso denegado para acceder o modificar la publicación del grupo'
    },
    status: HttpStatus.FORBIDDEN
  })
};

export default errors;
