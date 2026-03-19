import { Module } from '@nestjs/common';

import { AuthModule } from './controllers/auth/auth.module';
import { DeckModule } from './controllers/deck/deck.module';
import { DiaryModule } from './controllers/diary/diary.module';
import { FlashcardModule } from './controllers/flashcard/flashcard.module';
import { GroupModule } from './controllers/group/group.module';
import { GroupMemberModule } from './controllers/group-member/group-member.module';
import { GroupPostModule } from './controllers/group-post/group-post.module';
import { QuizModule } from './controllers/quiz/quiz.module';
import { QuizItemModule } from './controllers/quiz-item/quiz-item.module';
import { ResourceConversionModule } from './controllers/resource-conversion/resource-conversion.module';
import { ResourceShareModule } from './controllers/resource-share/resource-share.module';
import { ResourceShareLinkModule } from './controllers/resource-share-link/resource-share-link.module';
import { TaskModule } from './controllers/task/task.module';
import { UserModule } from './controllers/user/user.module';
import { WhiteboardModule } from './controllers/whiteboard/whiteboard.module';

@Module({
  imports: [
    AuthModule,
    DeckModule,
    DiaryModule,
    FlashcardModule,
    GroupModule,
    GroupMemberModule,
    GroupPostModule,
    QuizModule,
    QuizItemModule,
    ResourceConversionModule,
    ResourceShareModule,
    ResourceShareLinkModule,
    TaskModule,
    UserModule,
    WhiteboardModule
  ]
})
export class HttpModule {}
