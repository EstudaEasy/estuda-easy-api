import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'FlashcardNotFoundError',
  NOT_UPDATED = 'FlashcardNotUpdatedError',
  NOT_DELETED = 'FlashcardNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Flashcard não encontrado',
      en_US: 'Flashcard not found',
      es_ES: 'Flashcard no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o flashcard',
      en_US: 'Error updating flashcard',
      es_ES: 'Error al actualizar el flashcard'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o flashcard',
      en_US: 'Error deleting flashcard',
      es_ES: 'Error al eliminar el flashcard'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
