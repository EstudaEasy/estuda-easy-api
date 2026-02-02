import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'QuizNotFoundError',
  NOT_UPDATED = 'QuizNotUpdatedError',
  NOT_DELETED = 'QuizNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Quiz não encontrado',
      en_US: 'Quiz not found',
      es_ES: 'Quiz no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o quiz',
      en_US: 'Error updating quiz',
      es_ES: 'Error al actualizar el quiz'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o quiz',
      en_US: 'Error deleting quiz',
      es_ES: 'Error al eliminar el quiz'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
