import { HttpStatus } from '@nestjs/common';

import { ErrorsMap } from '@core/types';

export enum ErrorCode {
  NOT_FOUND = 'ResourceShareNotFoundError',
  NOT_UPDATED = 'ResourceShareNotUpdatedError',
  NOT_DELETED = 'ResourceShareNotDeletedError',
  NOT_OWNER = 'ResourceShareNotOwnerError'
}

const errors: ErrorsMap<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Compartilhamento de recurso não encontrado',
      en_US: 'Resource share not found',
      es_ES: 'Compartición de recurso no encontrada'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.NOT_UPDATED]: () => ({
    message: {
      pt_BR: 'Erro ao atualizar compartilhamento de recurso',
      en_US: 'Error updating resource share',
      es_ES: 'Error al actualizar la compartición de recurso'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.NOT_DELETED]: () => ({
    message: {
      pt_BR: 'Erro ao revogar compartilhamento de recurso',
      en_US: 'Error revoking resource share',
      es_ES: 'Error al revocar la compartición de recurso'
    },
    status: HttpStatus.CONFLICT
  }),
  [ErrorCode.NOT_OWNER]: () => ({
    message: {
      pt_BR: 'Apenas o proprietário do recurso pode gerenciar seus compartilhamentos',
      en_US: 'Only the resource owner can manage its shares',
      es_ES: 'Solo el propietario del recurso puede gestionar sus comparticiones'
    },
    status: HttpStatus.FORBIDDEN
  })
};

export default errors;
