import { HttpException } from '@nestjs/common';

import { Lang } from '@core/types';

import auth, { ErrorCode as AuthErrorCodes } from './auth/auth.errors';
import group, { ErrorCode as GroupErrorCodes } from './group/group.errors';
import groupMember, { ErrorCode as GroupMemberErrorCodes } from './group-member/group-member.errors';
import quiz, { ErrorCode as QuizErrorCodes } from './quiz/quiz.errors';
import quizItem, { ErrorCode as QuizItemErrorCodes } from './quiz-item/quiz-item.errors';
import user, { ErrorCode as UserErrorCodes } from './user/user.errors';

export { AuthErrorCodes, GroupErrorCodes, GroupMemberErrorCodes, QuizErrorCodes, QuizItemErrorCodes, UserErrorCodes };

export const errors = {
  ...auth,
  ...group,
  ...groupMember,
  ...quiz,
  ...quizItem,
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
