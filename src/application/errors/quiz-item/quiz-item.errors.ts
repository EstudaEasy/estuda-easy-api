import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'QuizItemNotFoundError',
  NOT_UPDATED = 'QuizItemNotUpdatedError',
  NOT_DELETED = 'QuizItemNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Item do quiz não encontrado',
      en_US: 'Quiz item not found',
      es_ES: 'Ítem del quiz no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o item do quiz',
      en_US: 'Error updating quiz item',
      es_ES: 'Error al actualizar el ítem del quiz'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o item do quiz',
      en_US: 'Error deleting quiz item',
      es_ES: 'Error al eliminar el ítem del quiz'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
