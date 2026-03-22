import { HttpStatus } from '@nestjs/common';

import { ErrorsMap } from '@core/types';

export enum ErrorCode {
  NOT_FOUND = 'ResourceShareLinkNotFoundError',
  NOT_DELETED = 'ResourceShareLinkNotDeletedError',
  NOT_UPDATED = 'ResourceShareLinkNotUpdatedError',
  INVALID_PERMISSION_TO_GENERATE = 'ResourceShareLinkInvalidPermissionToGenerateError',
  INVALID_PERMISSION_TO_DELETE = 'ResourceShareLinkInvalidPermissionToDeleteError',
  OWNER_CANNOT_JOIN = 'ResourceShareLinkOwnerCannotJoinError'
}

const errors: ErrorsMap<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Link de compartilhamento não encontrado',
      en_US: 'Share link not found',
      es_ES: 'Enlace de compartir no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.NOT_DELETED]: () => ({
    message: {
      pt_BR: 'Erro ao revogar o link de compartilhamento',
      en_US: 'Error revoking share link',
      es_ES: 'Error al revocar el enlace de compartir'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.NOT_UPDATED]: () => ({
    message: {
      pt_BR: 'Erro ao atualizar o link de compartilhamento',
      en_US: 'Error updating share link',
      es_ES: 'Error al actualizar el enlace de compartir'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.INVALID_PERMISSION_TO_GENERATE]: () => ({
    message: {
      pt_BR: 'Permissão inválida para gerar link de compartilhamento',
      en_US: 'Invalid permission to generate share link',
      es_ES: 'Permiso inválido para generar enlace de compartir'
    },
    status: HttpStatus.FORBIDDEN
  }),
  [ErrorCode.INVALID_PERMISSION_TO_DELETE]: () => ({
    message: {
      pt_BR: 'Permissão inválida para deletar link de compartilhamento',
      en_US: 'Invalid permission to delete share link',
      es_ES: 'Permiso inválido para eliminar enlace de compartir'
    },
    status: HttpStatus.FORBIDDEN
  }),
  [ErrorCode.OWNER_CANNOT_JOIN]: () => ({
    message: {
      pt_BR: 'O proprietário do recurso não pode usar o link de compartilhamento',
      en_US: 'Resource owner cannot use share link',
      es_ES: 'El propietario del recurso no puede usar el enlace de compartir'
    },
    status: HttpStatus.FORBIDDEN
  })
};

export default errors;
