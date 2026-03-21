import { HttpStatus } from '@nestjs/common';

import { MapErrors } from '@core/types';

export enum ErrorCode {
  SOURCE_NOT_FOUND = 'ResourceConversionSourceNotFoundError',
  INVALID_CONVERSION = 'ResourceConversionInvalidConversionError',
  AI_GENERATION_FAILED = 'ResourceConversionAiGenerationFailedError'
}

const errors: MapErrors<ErrorCode> = {
  [ErrorCode.SOURCE_NOT_FOUND]: () => ({
    message: {
      pt_BR: 'Recurso de origem não encontrado',
      en_US: 'Source resource not found',
      es_ES: 'Recurso de origen no encontrado'
    },
    status: HttpStatus.NOT_FOUND
  }),
  [ErrorCode.INVALID_CONVERSION]: () => ({
    message: {
      pt_BR: 'Conversão entre os tipos informados não é suportada',
      en_US: 'Conversion between the given types is not supported',
      es_ES: 'La conversión entre los tipos indicados no está soportada'
    },
    status: HttpStatus.UNPROCESSABLE_ENTITY
  }),
  [ErrorCode.AI_GENERATION_FAILED]: () => ({
    message: {
      pt_BR: 'Falha ao gerar conteúdo com IA',
      en_US: 'Failed to generate content with AI',
      es_ES: 'Error al generar contenido con IA'
    },
    status: HttpStatus.INTERNAL_SERVER_ERROR
  })
};

export default errors;
