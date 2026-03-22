import { HttpException } from '@nestjs/common';

import { applicationErrors } from '@application/errors';
import { pipeErrors, PipeErrorsParams } from '@core/pipes/errors';
import { Lang } from '@core/types';

const errors = {
  ...applicationErrors,
  ...pipeErrors
};

type ErrorCodes = keyof typeof errors;
type ErrorParams = PipeErrorsParams;

export class Exception<E extends ErrorCodes> extends HttpException {
  constructor(
    public readonly code: E,
    public readonly params?: E extends keyof ErrorParams ? ErrorParams[E] : undefined,
    public readonly lang: Lang = 'pt_BR'
  ) {
    const { status, message } = errors[code](params as any);
    const formattedMessage = Exception.formatMessage(message[lang], params);

    super(formattedMessage, status);
  }

  private static formatMessage(message: string, params?: Record<string, unknown>): string {
    if (!params) return message;

    for (const [key, value] of Object.entries(params)) {
      message = message.replace(`{{${key}}}`, String(value));
    }
    return message;
  }
}
