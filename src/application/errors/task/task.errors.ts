import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'TaskNotFoundError',
  NOT_UPDATED = 'TaskNotUpdatedError',
  NOT_DELETED = 'TaskNotDeletedError',
  INVALID_DATE_RANGE = 'TaskInvalidDateRangeError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Tarefa não encontrada',
      en_US: 'Task not found',
      es_ES: 'Tarea no encontrada'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar a tarefa',
      en_US: 'Error updating task',
      es_ES: 'Error al actualizar la tarea'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar a tarefa',
      en_US: 'Error deleting task',
      es_ES: 'Error al eliminar la tarea'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.INVALID_DATE_RANGE]: {
    message: {
      pt_BR: 'A data de término deve ser posterior à data de início',
      en_US: 'End date must be after start date',
      es_ES: 'La fecha de finalización debe ser posterior a la fecha de inicio'
    },
    status: HttpStatus.BAD_REQUEST
  }
};

export default errors;
