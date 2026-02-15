import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'WhiteboardNotFoundError',
  NOT_UPDATED = 'WhiteboardNotUpdatedError',
  NOT_DELETED = 'WhiteboardNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Whiteboard não encontrado',
      en_US: 'Whiteboard not found',
      es_ES: 'Whiteboard no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o whiteboard',
      en_US: 'Error updating whiteboard',
      es_ES: 'Error al actualizar el whiteboard'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o whiteboard',
      en_US: 'Error deleting whiteboard',
      es_ES: 'Error al eliminar el whiteboard'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
