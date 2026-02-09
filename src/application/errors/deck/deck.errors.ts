import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'DeckNotFoundError',
  NOT_UPDATED = 'DeckNotUpdatedError',
  NOT_DELETED = 'DeckNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Deck não encontrado',
      en_US: 'Deck not found',
      es_ES: 'Deck no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o deck',
      en_US: 'Error updating deck',
      es_ES: 'Error al actualizar el deck'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o deck',
      en_US: 'Error deleting deck',
      es_ES: 'Error al eliminar el deck'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
