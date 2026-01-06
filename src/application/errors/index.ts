import { HttpException } from '@nestjs/common';

import { Lang } from '@core/types';

import auth, { ErrorCode as AuthErrorCodes } from './auth/auth.errors';
import user, { ErrorCode as UserErrorCodes } from './user/user.errors';

export { AuthErrorCodes, UserErrorCodes };

export const errors = {
  ...auth,
  ...user
};

export class Exception extends HttpException {
  public readonly code: keyof typeof errors;
  public readonly lang?: Lang;

  constructor(code: keyof typeof errors, lang: Lang = 'pt_BR') {
    const { status, message } = errors[code];

    super(message[lang], status);

    this.code = code;
    this.lang = lang;
  }
}
