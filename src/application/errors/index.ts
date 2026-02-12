import { HttpException } from '@nestjs/common';

import { Lang } from '@core/types';

import auth, { ErrorCode as AuthErrorCodes } from './auth/auth.errors';
import deck, { ErrorCode as DeckErrorCodes } from './deck/deck.errors';
import flashcard, { ErrorCode as FlashcardErrorCodes } from './flashcard/flashcard.errors';
import group, { ErrorCode as GroupErrorCodes } from './group/group.errors';
import groupMember, { ErrorCode as GroupMemberErrorCodes } from './group-member/group-member.errors';
import quiz, { ErrorCode as QuizErrorCodes } from './quiz/quiz.errors';
import quizItem, { ErrorCode as QuizItemErrorCodes } from './quiz-item/quiz-item.errors';
import resource, { ErrorCode as ResourceErrorCodes } from './resource/resource.errors';
import task, { ErrorCode as TaskErrorCodes } from './task/task.errors';
import user, { ErrorCode as UserErrorCodes } from './user/user.errors';

export {
  AuthErrorCodes,
  DeckErrorCodes,
  FlashcardErrorCodes,
  GroupErrorCodes,
  GroupMemberErrorCodes,
  QuizErrorCodes,
  QuizItemErrorCodes,
  ResourceErrorCodes,
  TaskErrorCodes,
  UserErrorCodes
};

export const errors = {
  ...auth,
  ...deck,
  ...flashcard,
  ...group,
  ...groupMember,
  ...resource,
  ...quiz,
  ...quizItem,
  ...task,
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
