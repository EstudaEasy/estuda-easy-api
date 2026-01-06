import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  EMAIL_ALREADY_IN_USE = 'UserEmailAlreadyInUseError',
  NOT_FOUND = 'UserNotFoundError',
  NOT_UPDATED = 'UserNotUpdatedError',
  NOT_DELETED = 'UserNotDeletedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.EMAIL_ALREADY_IN_USE]: {
    message: {
      pt_BR: 'O email informado já está em uso',
      en_US: 'The provided email is already in use',
      es_ES: 'El correo electrónico proporcionado ya está en uso'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Usuário não encontrado',
      en_US: 'User not found',
      es_ES: 'Usuario no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o usuário',
      en_US: 'Error updating user',
      es_ES: 'Error al actualizar el usuario'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao deletar o usuário',
      en_US: 'Error deleting user',
      es_ES: 'Error al eliminar el usuario'
    },
    status: HttpStatus.CONFLICT
  }
};

export default errors;
