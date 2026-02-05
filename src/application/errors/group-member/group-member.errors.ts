import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '../types';

export enum ErrorCode {
  NOT_FOUND = 'GroupMemberNotFoundError',
  NOT_UPDATED = 'GroupMemberNotUpdatedError',
  NOT_DELETED = 'GroupMemberNotDeletedError',
  ALREADY_MEMBER = 'GroupMemberAlreadyExistsError',
  PERMISSION_DENIED = 'GroupMemberPermissionDeniedError',
  CANNOT_CHANGE_OWNER_ROLE = 'GroupMemberCannotChangeOwnerRoleError',
  CANNOT_REMOVE_OWNER = 'GroupMemberCannotRemoveOwnerError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.NOT_FOUND]: {
    message: {
      pt_BR: 'Membro do grupo não encontrado',
      en_US: 'Group member not found',
      es_ES: 'Miembro del grupo no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  },
  [ErrorCode.NOT_UPDATED]: {
    message: {
      pt_BR: 'Erro ao atualizar o membro do grupo',
      en_US: 'Error updating group member',
      es_ES: 'Error al actualizar el miembro del grupo'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.NOT_DELETED]: {
    message: {
      pt_BR: 'Erro ao remover o membro do grupo',
      en_US: 'Error removing group member',
      es_ES: 'Error al eliminar el miembro del grupo'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.ALREADY_MEMBER]: {
    message: {
      pt_BR: 'Usuário já é membro deste grupo',
      en_US: 'User is already a member of this group',
      es_ES: 'El usuario ya es miembro de este grupo'
    },
    status: HttpStatus.CONFLICT
  },
  [ErrorCode.PERMISSION_DENIED]: {
    message: {
      pt_BR: 'Você não tem permissão para realizar esta ação no membro do grupo',
      en_US: 'You do not have permission to perform this action on the group member',
      es_ES: 'No tienes permiso para realizar esta acción en el miembro del grupo'
    },
    status: HttpStatus.FORBIDDEN
  },
  [ErrorCode.CANNOT_CHANGE_OWNER_ROLE]: {
    message: {
      pt_BR: 'Não é possível alterar a role do dono do grupo',
      en_US: 'Cannot change the role of the group owner',
      es_ES: 'No se puede cambiar el rol del propietario del grupo'
    },
    status: HttpStatus.FORBIDDEN
  },
  [ErrorCode.CANNOT_REMOVE_OWNER]: {
    message: {
      pt_BR: 'Não é possível remover o dono do grupo',
      en_US: 'Cannot remove the group owner',
      es_ES: 'No se puede eliminar al propietario del grupo'
    },
    status: HttpStatus.FORBIDDEN
  }
};

export default errors;
