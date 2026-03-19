import { HttpException } from '@nestjs/common';

import { Lang } from '@core/types';

import auth, { ErrorCode as AuthErrorCodes } from './auth/auth.errors';
import deck, { ErrorCode as DeckErrorCodes } from './deck/deck.errors';
import diary, { ErrorCode as DiaryErrorCodes } from './diary/diary.errors';
import flashcard, { ErrorCode as FlashcardErrorCodes } from './flashcard/flashcard.errors';
import group, { ErrorCode as GroupErrorCodes } from './group/group.errors';
import groupMember, { ErrorCode as GroupMemberErrorCodes } from './group-member/group-member.errors';
import groupPost, { ErrorCode as GroupPostErrorCodes } from './group-post/group-post.errors';
import quiz, { ErrorCode as QuizErrorCodes } from './quiz/quiz.errors';
import quizItem, { ErrorCode as QuizItemErrorCodes } from './quiz-item/quiz-item.errors';
import resource, { ErrorCode as ResourceErrorCodes } from './resource/resource.errors';
import resourceConversion, {
  ErrorCode as ResourceConversionErrorCodes
} from './resource-conversion/resource-conversion.errors';
import resourceShare, { ErrorCode as ResourceShareErrorCodes } from './resource-share/resource-share.errors';
import resourceShareLink, {
  ErrorCode as ResourceShareLinkErrorCodes
} from './resource-share-link/resource-share-link.errors';
import task, { ErrorCode as TaskErrorCodes } from './task/task.errors';
import user, { ErrorCode as UserErrorCodes } from './user/user.errors';
import whiteboard, { ErrorCode as WhiteboardErrorCodes } from './whiteboard/whiteboard.errors';

export {
  AuthErrorCodes,
  DeckErrorCodes,
  DiaryErrorCodes,
  FlashcardErrorCodes,
  GroupErrorCodes,
  GroupMemberErrorCodes,
  GroupPostErrorCodes,
  QuizErrorCodes,
  QuizItemErrorCodes,
  ResourceConversionErrorCodes,
  ResourceErrorCodes,
  ResourceShareErrorCodes,
  ResourceShareLinkErrorCodes,
  TaskErrorCodes,
  UserErrorCodes,
  WhiteboardErrorCodes
};

export const errors = {
  ...auth,
  ...deck,
  ...diary,
  ...flashcard,
  ...group,
  ...groupMember,
  ...groupPost,
  ...resource,
  ...resourceConversion,
  ...resourceShare,
  ...resourceShareLink,
  ...quiz,
  ...quizItem,
  ...task,
  ...whiteboard,
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
