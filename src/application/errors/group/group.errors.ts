import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'GroupNotFoundError',
  NOT_UPDATED = 'GroupNotUpdatedError',
  NOT_DELETED = 'GroupNotDeletedError',
  ONLY_OWNER_PERMISSION = 'GroupOnlyOwnerPermissionError',
  PERMISSION_DENIED = 'GroupPermissionDeniedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Grupo não encontrado',
      en_US: 'Group not found',
      es_ES: 'Grupo no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o grupo',
      en_US: 'Error updating group',
      es_ES: 'Error al actualizar el grupo'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o grupo',
      en_US: 'Error deleting group',
      es_ES: 'Error al eliminar el grupo'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.ONLY_OWNER_PERMISSION]: {
    message: {
      pt_BR: 'Apenas o dono do grupo pode realizar esta ação no grupo',
      en_US: 'Only the group owner can perform this action on the group',
      es_ES: 'Solo el propietario del grupo puede realizar esta acción en el grupo'
    },
    status: HttpStatus.FORBIDDEN
  },
  [ErrorCode.PERMISSION_DENIED]: {
    message: {
      pt_BR: 'Você não tem permissão para realizar esta ação no grupo',
      en_US: 'You do not have permission to perform this action on the group',
      es_ES: 'No tienes permiso para realizar esta acción en el grupo'
    },
    status: HttpStatus.FORBIDDEN
  }
};

export default errors;
