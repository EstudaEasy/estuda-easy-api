import { HttpException } from '@nestjs/common';

import { applicationErrors } from '@application/errors';
import { pipeErrors } from '@core/pipes/errors';
import { Lang } from '@core/types';

const errors = {
  ...applicationErrors,
  ...pipeErrors
};

export class Exception extends HttpException {
  public readonly code: keyof typeof errors;
  public readonly params?: Record<string, unknown>;
  public readonly lang?: Lang;

  constructor(code: keyof typeof errors, params?: Record<string, unknown>, lang: Lang = 'pt_BR') {
    const { status, message } = errors[code](params);
    const formattedMessage = Exception.formatMessage(message[lang], params);

    super(formattedMessage, status);

    this.params = params;
    this.code = code;
    this.lang = lang;
  }

  private static formatMessage(message: string, params?: Record<string, unknown>): string {
    if (!params) return message;

    for (const [key, value] of Object.entries(params)) {
      message = message.replace(`{{${key}}}`, String(value));
    }
    return message;
  }
}
