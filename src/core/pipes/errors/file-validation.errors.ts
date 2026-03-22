import { HttpStatus } from '@nestjs/common';

import { ErrorsMap } from '@core/types';

export enum ErrorCode {
  FILE_NOT_PROVIDED = 'FileNotProvidedError',
  FILE_TOO_LARGE = 'FileTooLargeError',
  INVALID_FILE_TYPE = 'InvalidFileTypeError'
}

export type ErrorParams = {
  [ErrorCode.FILE_TOO_LARGE]: { maxSize: number };
  [ErrorCode.INVALID_FILE_TYPE]: { expectedTypes: string };
};

const errors: ErrorsMap<ErrorCode, ErrorParams> = {
  [ErrorCode.FILE_NOT_PROVIDED]: () => ({
    message: {
      pt_BR: 'Nenhum arquivo foi enviado.',
      en_US: 'No file was provided.',
      es_ES: 'Ningún archivo fue proporcionado.'
    },
    status: HttpStatus.BAD_REQUEST
  }),
  [ErrorCode.FILE_TOO_LARGE]: (params) => ({
    message: {
      pt_BR: 'O tamanho do arquivo excede o limite de {{maxSize}} MB.',
      en_US: 'The file size exceeds the limit of {{maxSize}} MB.',
      es_ES: 'El tamaño del archivo excede el límite de {{maxSize}} MB.'
    },
    params,
    status: HttpStatus.BAD_REQUEST
  }),
  [ErrorCode.INVALID_FILE_TYPE]: (params) => ({
    message: {
      pt_BR: 'O tipo do arquivo é inválido. Tipos permitidos: {{expectedTypes}}.',
      en_US: 'The file type is invalid. Allowed types: {{expectedTypes}}.',
      es_ES: 'El tipo del archivo es inválido. Tipos permitidos: {{expectedTypes}}.'
    },
    params,
    status: HttpStatus.BAD_REQUEST
  })
};

export default errors;
